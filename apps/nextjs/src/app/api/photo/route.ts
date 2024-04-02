import type { NextRequest } from "next/server";
import { headers } from "next/headers";
import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

async function getStorage() {
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

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const action = searchParams.get("action");

  if (action === "upload") {
    return upload(searchParams);
  } else if (action === "download") {
    return download(searchParams);
  } else if (action === "move") {
    return move(searchParams);
  }
}

// TODO: Only the server itself should be able to access this route.
async function move(searchParams: URLSearchParams) {
  const signedUrl = searchParams.get("signedUrl");
  const size = searchParams.get("size");
  if (!signedUrl || !size) {
    return Response.json(
      { error: "signedUrl and size query parameters are required" },
      { status: 400 },
    );
  }

  const signedUrlString = z.string().parse(signedUrl);
  const sizeInt = z
    .string()
    .pipe(z.coerce.number().nonnegative().lte(MAX_FILE_SIZE))
    .parse(size);

  moveFileIfVerified(
    signedUrlString,
    sizeInt,
    "restauwants_staging",
    "restauwants_production",
  ).catch(() => Response.json({ success: false }));
  return Response.json({ success: true });
}

// TODO: Only the server should be able to access this route.
async function download(searchParams: URLSearchParams) {
  const photoId = searchParams.get("photoId");
  if (!photoId) {
    return Response.json(
      { error: "photoId query parameter is required" },
      { status: 400 },
    );
  }
  const url = await getSignedDownloadUrl(photoId);

  return Response.json({ presignedUrl: url });
}

async function upload(searchParams: URLSearchParams) {
  const size = searchParams.get("size");
  if (!size) {
    return Response.json(
      { error: "Size query parameter is required" },
      { status: 400 },
    );
  }
  const sizeInt = z
    .string()
    .pipe(
      z.coerce.number().nonnegative().lte(MAX_FILE_SIZE), // TODO: define this as a zod schema
    )
    .parse(size);

  const url = await getSignedUploadUrl(sizeInt);

  return Response.json({ presignedUrl: url });
}

// TODO: Validation is all messed up because the route handler is not typed :(
async function getSignedDownloadUrl(filename: string) {
  const options = {
    action: "read" as const,
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
    extensionHeaders: { "content-length": fileSize },
    contentType: "image/jpeg", //"application/octet-stream",
  };

  return getSignedUrl(stagingBucket, filename, options);
}

async function getSignedUrl(
  bucketName: string,
  filename: string,
  inputOptions: {
    action: "write" | "read";
    extensionHeaders?: { "content-length": number };
  },
): Promise<string> {
  const storage = await getStorage();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filename);

  const origin = headers().get("host");
  if (origin) {
    // set the cors configuration
    await bucket.setCorsConfiguration([
      {
        maxAgeSeconds: 3600,
        method: ["OPTIONS", "POST", "PUT", "GET"],
        origin: [getBaseUrl()],
        responseHeader: ["Access-Control-Allow-Origin", "Content-Type", "Vary"],
      },
    ]);
  } else {
    return Promise.reject(new Error("No origin header found."));
  }

  const options = {
    version: "v4" as const,
    expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    ...inputOptions,
  };

  const [url] = await file.getSignedUrl(options);

  return url;
}

async function verifySignedUrl(
  checkUrlString: string,
  fileSize: number,
): Promise<boolean> {
  const url = new URL(checkUrlString);
  const storage = await getStorage();

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
    contentType: "image/jpeg", //"application/octet-stream",
  };

  const [signedUrlString] = await file.getSignedUrl(options);

  return signedUrlString === checkUrlString;
}

async function moveFileIfVerified(
  signedUrl: string,
  fileSize: number,
  srcBucketName: string,
  destBucketName: string,
) {
  const verified = await verifySignedUrl(signedUrl, fileSize);
  if (!verified) {
    throw new Error("Invalid signed URL");
  }
  // Get the image name (signed URL must be valid)
  // TODO: Edge cases that have not been checked-
  // - File is already in dest bucket before moving
  // - signedUrl is empty
  // - Maybe others?
  const url = new URL(signedUrl);
  const filename = url.pathname.split("/").pop()!;

  const storage = await getStorage();
  const srcBucket = storage.bucket(srcBucketName);
  const destBucket = storage.bucket(destBucketName);

  await srcBucket.file(filename).move(destBucket.file(filename));
}

function getBaseUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
