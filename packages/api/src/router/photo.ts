import { z } from "zod";

import type { Database } from "@restauwants/db";
import { eq, schema } from "@restauwants/db";
import { PhotoSchema as PhotoSchemaDatabase } from "@restauwants/validators/db";
import { CreatePhotosSchema as CreatePhotosSchemaExternal } from "@restauwants/validators/server/external";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const photoRouter = createTRPCRouter({
  getSignedUploadUrl: protectedProcedure
    .input(
      z
        .number()
        .nonnegative()
        .lt(3 * 1024 * 1024),
    )
    .mutation(async ({ input }) => {
      const res = await fetch(
        getBaseUrl() + `/api/photo?action=upload&size=${input}`,
      );
      const { presignedUrl } = (await res.json()) as { presignedUrl: string };
      return presignedUrl;
    }),

  /*
  create: protectedProcedure
    .input(CreatePhotoSchemaExternal)
    .mutation(async ({ ctx, input }) => {
        await ctx.db.insert(schema.photo).values(
          PhotoSchemaDatabase.parse({
            ...input,
            createdAt: new Date(),
          }),
        );
      }),
      */

  addPhotosToReview: protectedProcedure
    .input(CreatePhotosSchemaExternal)
    .mutation(async ({ ctx, input }) => {
      // If the user does not own the review, or the review does not exist,
      // do not move their file to the prod bucket
      const review = await ctx.db.query.review.findFirst({
        where: eq(schema.review.id, input.reviewId),
      });
      if (!review) {
        throw new Error("Review not found");
      }
      if (review.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      const filenames = [] as string[];
      // Move every file to prod bucket
      // TODO: verify signedUrls and size are same length
      for (let i = 0; i < input.signedUrls.length; i++) {
        const signedUrl = input.signedUrls[i];
        const size = input.sizes[i];
        if (!signedUrl || !size) {
          throw new Error("signedUrl and size query parameters are required");
        }
        /*
        const res = await fetch(
          getBaseUrl() +
            `/api/photo?action=move&signedUrl=${encodeURIComponent(
              signedUrl,
            )}&size=${size}`,
        );

        const { success } = (await res.json()) as { success: boolean };*/
        const success = true;
        if (success) {
          // This is safe as long as the "move" action in the above fetch verifies the URL
          const url = new URL(signedUrl);
          const filename = url.pathname.split("/").pop();
          if (filename) {
            filenames.push(filename);
          }
        }
      }
      addPhotosToReviewInDB(ctx, input.reviewId, filenames).catch((e) => {
        throw e;
      });
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

// PRECONDITION: The user must own the review
async function addPhotosToReviewInDB(
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

  return ctx.db.insert(schema.photo).values(rows);
}

// Precondition: user owns the review
export const deleteByReviewId = async (db: Database, reviewId: number) => {
  const photos = await db.query.photo.findMany({
    where: eq(schema.photo.reviewId, reviewId),
  });
  for (const filename of photos) {
    const res = await fetch(
      getBaseUrl() +
        `/api/photo?action=delete&filename=${encodeURIComponent(filename.id)}`,
    );

    // TODO: What if some files are deleted and others aren't?
    (await res.json()) as { success: boolean };
  }
  await db.delete(schema.photo).where(eq(schema.photo.reviewId, reviewId));
};

// PRECONDITION: reviewid is valid
// PRECONDITION: user is authorized to view the photos
export const byReviewId = async (db: Database, reviewId: number) => {
  const photos = await db.query.photo.findMany({
    where: eq(schema.photo.reviewId, reviewId),
  });
  // get the signed urls for the photos
  const signedUrls = photos.map(async (photo) => {
    const res = await fetch(
      getBaseUrl() + `/api/photo?action=download&photoId=${photo.id}`,
      { next: { revalidate: 3600 } },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch presigned URL");
    }
    const { presignedUrl } = (await res.json()) as { presignedUrl: string };
    return presignedUrl;
  });
  return Promise.all(signedUrls);
};

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
