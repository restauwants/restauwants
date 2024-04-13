import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import type { Database } from "@restauwants/db";
import { eq, schema } from "@restauwants/db";
import { PhotoSchema as PhotoSchemaDatabase } from "@restauwants/validators/db";
import { CreatePhotosSchema as CreatePhotosSchemaExternal } from "@restauwants/validators/server/external";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const photoRouter = createTRPCRouter({
  getSignedUploadUrl: protectedProcedure
    .input(z.number().nonnegative().lt(MAX_FILE_SIZE))
    .mutation(async ({ input }) => {
      return getSignedUploadUrl(input);
    }),

  addPhotosToReview: protectedProcedure
    .input(CreatePhotosSchemaExternal)
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.db.query.review.findFirst({
        where: eq(schema.review.id, input.reviewId),
      });

      // Error checking
      if (!review) {
        throw new Error("Review not found");
      } else if (review.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      } else if (input.signedUrls.length !== input.sizes.length) {
        throw new Error("signedUrls and sizes must be the same length");
      }

      const filenames: Promise<string>[] = [];
      for (let i = 0; i < input.signedUrls.length; i++) {
        const filename = getFileFromSignedUrl(
          input.signedUrls[i]!,
          input.sizes[i]!,
        )
          .then((filename) =>
            moveFile(
              filename,
              "restauwants_staging",
              "restauwants_production",
            ).then(() => filename),
          )
          .catch((e) => {
            throw new Error(`Error adding photos to review: ${e}`);
          });
        filenames.push(filename);
      }
      addPhotosToReviewInDB(ctx, input.reviewId, await Promise.all(filenames));
    }),

  // TODO: needs to also delete the files from the production storage bucket
  // delete should only be called by the user who owns the review
  delete: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      const photo = await ctx.db.query.photo.findFirst({
        where: eq(schema.photo.id, input),
      });
      if (!photo) {
        throw new Error("Photo not found");
      }
      const review = await ctx.db.query.review.findFirst({
        where: eq(schema.review.id, photo.reviewId),
      });
      if (!review) {
        // This would be really bad...
        throw new Error("Review not found");
      } else if (review.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }
      await ctx.db.delete(schema.photo).where(eq(schema.photo.id, input));
    }),
});

async function getFileFromSignedUrl(
  signedUrl: string,
  size: number,
): Promise<string> {
  if (await verifySignedUrl(signedUrl, size)) {
    return new URL(signedUrl).pathname.split("/").pop()!;
  } else {
    throw new Error("Invalid signed URL");
  }
}

// PRECONDITION: The user must own the review
function addPhotosToReviewInDB(
  ctx: {
    session: {
      user: {
        id: string;
      };
      expires: string;
    };
    db: Database;
  },
  reviewId: number,
  photoIds: string[],
) {
  interface row {
    reviewId: number;
    id: string;
    createdAt: Date;
  }

  if (photoIds.length === 0) {
    return;
  }

  const rows = [] as row[];
  for (const id of photoIds) {
    rows.push(
      PhotoSchemaDatabase.parse({
        reviewId: reviewId,
        id,
        createdAt: new Date(),
      }),
    );
  }

  ctx.db
    .insert(schema.photo)
    .values(rows)
    .catch((e) => {
      throw new Error(`Error adding photos to review: ${e}`);
    });
}

// Precondition: user owns the review
export const deleteByReviewId = async (db: Database, reviewId: number) => {
  const photos = await db.query.photo.findMany({
    where: eq(schema.photo.reviewId, reviewId),
  });

  for (const photo of photos) {
    const filename = photo.id;
    // TODO: What if some files are deleted and others aren't?
    // Current behaviour is to continue trying to delete the remaining photos
    deleteFile(filename, "restauwants_production").catch(() => {
      console.error(`Error deleting photo ${filename}`);
    });
    await db.delete(schema.photo).where(eq(schema.photo.reviewId, reviewId));
  }
};

// PRECONDITION: reviewid is valid
// PRECONDITION: user is authorized to view the photos
export const byReviewId = async (db: Database, reviewId: number) => {
  const photos = await db.query.photo.findMany({
    where: eq(schema.photo.reviewId, reviewId),
  });
  // TODO: What is the expected behaviour if one of the signed urls fails to be generated?
  // Right now in that case all photos fail to load
  const signedUrls = photos.map((photo) =>
    getSignedDownloadUrl(photo.id).catch((e) => {
      throw new Error(`Error getting signed url for photo ${photo.id}: ${e}`);
    }),
  );

  return Promise.all(signedUrls);
};

function getStorage() {
  return new Storage({
    projectId: "nifty-edge-415820",
    credentials: {
      client_email: process.env.GCS_CLIENT_EMAIL,
      private_key: process.env.GCS_PRIVATE_KEY?.split(String.raw`\n`).join(
        "\n",
      ),
    },
  });
}

// TODO: Validation is all messed up because the route handler is not typed :(
async function getSignedDownloadUrl(filename: string) {
  const options = {
    action: "read" as const,
    expires: Date.now() + 3600 * 1000, // 1 hour
  };

  const prodBucket = "restauwants_production";

  return getSignedUrl(prodBucket, filename, options);
}

async function getSignedUploadUrl(fileSize: number) {
  if (0 >= fileSize) {
    return Promise.reject(new Error("No file attached."));
  } else if (fileSize > MAX_FILE_SIZE) {
    return Promise.reject(new Error("File size too large."));
  }

  const stagingBucket = "restauwants_staging";
  // Filenames should be generated with uuids to avoid overwrite conflicts in the bucket
  const filename = uuidv4();

  const options = {
    action: "write" as const,
    expires: Date.now() + 600 * 1000, // 10 minutes
    extensionHeaders: { "content-length": fileSize },
  };

  return getSignedUrl(stagingBucket, filename, options);
}

async function getSignedUrl(
  bucketName: string,
  filename: string,
  inputOptions: {
    action: "write" | "read";
    expires: number;
    extensionHeaders?: { "content-length": number };
  },
): Promise<string> {
  const storage = getStorage();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filename);

  const options = {
    version: "v4" as const,
    ...inputOptions,
  };

  const [exists] = await file.exists();
  if (!exists && inputOptions.action === "read") {
    throw new Error("File does not exist.");
  }

  const [url] = await file.getSignedUrl(options);

  return url;
}

async function verifySignedUrl(
  checkUrlString: string,
  fileSize: number,
): Promise<boolean> {
  const url = new URL(checkUrlString);
  const storage = getStorage();

  // valid pathname is of the form "/restauwants_staging/{uuid}"
  const pathname_subdirs = url.pathname.split("/");
  if (pathname_subdirs.length != 3) return false;
  const bucketName = pathname_subdirs[1]!;
  const filename: string = pathname_subdirs[pathname_subdirs.length - 1]!;

  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filename);

  // xGoogDate is the date the signed url was created, xGoogExpires is number of seconds until the url expires
  const xGoogDate = url.searchParams.get("X-Goog-Date");
  const xGoogExpires = url.searchParams.get("X-Goog-Expires");
  if (xGoogDate == null || xGoogExpires == null) return false;

  if (xGoogDate.length != 16) return false;
  // xGoogDate is in the format "YYYYMMDDTHHMMSSZ"
  // we want it formatted as "YYYY-MM-DDTHH:MM:SSZ"
  const xGoogDate_formatted =
    xGoogDate.substring(0, 4) +
    "-" +
    xGoogDate.substring(4, 6) +
    "-" +
    xGoogDate.substring(6, 11) +
    ":" +
    xGoogDate.substring(11, 13) +
    ":" +
    xGoogDate.substring(13, 16);

  const options = {
    version: "v4" as const,
    action: "write" as const,
    accessibleAt: new Date(xGoogDate_formatted),
    expires:
      new Date(xGoogDate_formatted).getTime() + parseInt(xGoogExpires) * 1000,
    extensionHeaders: { "content-length": fileSize },
  };

  const [signedUrlString] = await file.getSignedUrl(options);

  return signedUrlString === checkUrlString;
}

async function moveFile(
  filename: string,
  srcBucketName: string,
  destBucketName: string,
) {
  const storage = getStorage();
  const srcBucket = storage.bucket(srcBucketName);
  const destBucket = storage.bucket(destBucketName);

  // check if the file exists first
  const file = srcBucket.file(filename);
  if (!(await file.exists())) {
    throw new Error("File to be moved was not uploaded to bucket.");
  } else {
    file.move(destBucket.file(filename), (e) => {
      if (e) {
        throw e;
      }
    });
  }
}

async function deleteFile(filename: string, bucketName: string) {
  // TODO: Verify for edge cases
  const storage = getStorage();
  const bucket = storage.bucket(bucketName);
  if (!(await bucket.exists())) {
    throw new Error("Bucket does not exist.");
  }

  // check if the file exists first
  const file = bucket.file(filename);
  if (!(await file.exists())) {
    throw new Error("File to be moved was not uploaded to bucket.");
  } else {
    await file.delete();
  }
}
