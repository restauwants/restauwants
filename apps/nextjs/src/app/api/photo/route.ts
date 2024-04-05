import type { NextRequest } from "next/server";
import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
await setCors();

async function setCors() {
  // Set the cors config once
  const storage = await getStorage();
  const stagingBucket = storage.bucket("restauwants_staging");
  const prodBucket = storage.bucket("restauwants_production");

  const config = {
    maxAgeSeconds: 3600,
    method: ["OPTIONS", "POST", "PUT", "GET"],
    origin: [getBaseUrl()],
    responseHeader: ["Access-Control-Allow-Origin", "Content-Type", "Vary"],
  };

  await stagingBucket.setCorsConfiguration([config]);
  console.log("Set cors config for staging bucket.");
  await prodBucket.setCorsConfiguration([config]);
  console.log("Set cors config for production bucket.");
}

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
  } else if (action === "delete") {
    return delete_(searchParams);
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

  return moveFileIfVerified(
    signedUrlString,
    sizeInt,
    "restauwants_staging",
    "restauwants_production",
  )
    .then(() => Response.json({ success: true }))
    .catch(() => Response.json({ success: false }));
}

// TODO: Only the server itself should be able to access this route.
// This is higher priority than move ... anyone can delete files this way
// Could be fixed by adding a secret key to the request
async function delete_(searchParams: URLSearchParams) {
  let filename = searchParams.get("filename");
  if (!filename) {
    return Response.json(
      { error: "filename query parameter is required" },
      { status: 400 },
    );
  }

  filename = z.string().uuid().parse(filename);

  deleteFileIfAuthenticated(filename, "restauwants_production").catch(() =>
    Response.json({ success: false }),
  );
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
  try {
    const url = await getSignedDownloadUrl(photoId);
    return Response.json({ presignedUrl: url });
  } catch (e) {
    return Response.json({ error: e }, { status: 400 });
  }
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

  try {
    const url = await getSignedUploadUrl(sizeInt);
    return Response.json({ presignedUrl: url });
  } catch (e) {
    return Response.json({ error: e }, { status: 400 });
  }
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

  const stagingBucket = "restauwants_production";
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
  const storage = await getStorage();
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

  // check if the file exists first
  const file = srcBucket.file(filename);
  if (!(await file.exists())) {
    throw new Error("File to be moved was not uploaded to bucket.");
  } else {
    const [moveRes] = await file.move(destBucket.file(filename));
    console.log(Array.isArray(moveRes));
    if (Array.isArray(moveRes) && moveRes.length == 2) {
      const [destFile, res] = moveRes as [unknown, unknown];
      if (destFile instanceof Storage.File) {
        console.log(destFile);
      } else {
        throw new Error("Error moving file");
      }
      console.log(res);
      return res;
    }
    throw new Error("Error moving file");
  }
}

async function deleteFileIfAuthenticated(filename: string, bucketName: string) {
  // TODO: Verify for edge cases
  const storage = await getStorage();
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

function getBaseUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
