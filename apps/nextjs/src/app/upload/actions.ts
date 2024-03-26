"use server";

import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";

import { getStorage } from "./storage";

const MAX_FILE_SIZE = 3 * 1024 ** 2; // 3MB

export async function verifySignedUrl(
  checkUrlString: string,
  fileSize: number,
): Promise<boolean> {
  const url = new URL(checkUrlString);
  const storage = await getStorage();

  // valid pathname is of the form "/restauwants_staging/{uuid}"
  const pathname_subdirs = url.pathname.split("/");
  if (pathname_subdirs.length != 3) return false; // TODO: fail, invalid url
  const bucketName = pathname_subdirs[1]!;
  const filename: string = pathname_subdirs[pathname_subdirs.length - 1]!;

  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filename);

  // xGoogDate is the date the signed url was created, xGoogExpires is number of seconds until the url expires
  const xGoogDate = url.searchParams.get("X-Goog-Date");
  const xGoogExpires = url.searchParams.get("X-Goog-Expires");
  if (xGoogDate == null || xGoogExpires == null) return false;

  if (xGoogDate.length != 16) return false; // TODO: fail, invalid date
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

  const expiry =
    new Date(xGoogDate_formatted).getTime() + parseInt(xGoogExpires) * 1000;

  const options = {
    version: "v4" as const,
    action: "write" as const,
    accessibleAt: new Date(xGoogDate_formatted),
    expires: expiry,
    extensionHeaders: { "content-length": fileSize },
    contentType: "image/jpeg", //"application/octet-stream",
  };

  const [signedUrlString] = await file.getSignedUrl(options);

  console.log("signedUrlString (in verifySignedUrl):", signedUrlString);
  console.log("checkUrlString (in verifySignedUrl):", checkUrlString);
  return signedUrlString === checkUrlString;
}

export async function getSignedUrl(
  contentLengthInBytes: number,
): Promise<[string, string]> {
  "use server";

  const storage = await getStorage();
  const bucket = storage.bucket("restauwants_staging");

  const origin = headers().get("host");
  if (origin) {
    console.log(origin);

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

  if (0 >= contentLengthInBytes) {
    return Promise.reject(new Error("No file attached."));
  } else if (contentLengthInBytes > MAX_FILE_SIZE) {
    return Promise.reject(new Error("File size too large."));
  }

  // Filenames should be generated with uuids to avoid overwrite conflicts in the bucket
  const filename = uuidv4();
  const file = bucket.file(filename);

  const options = {
    version: "v4" as const,
    action: "write" as const,
    expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    extensionHeaders: { "content-length": contentLengthInBytes },
    contentType: "image/jpeg", //"application/octet-stream",
  };

  const [url] = await file.getSignedUrl(options);

  return [url, filename];
}

function getBaseUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export async function moveFileIfVerified(
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
  // TODO: Need to check if the file is already in the dest bucket before moving
  // TODO: What happens if the signedUrl is empty?
  const url = new URL(signedUrl);
  const filename = url.pathname.split("/").pop()!;

  const storage = await getStorage();
  const srcBucket = storage.bucket(srcBucketName);
  const destBucket = storage.bucket(destBucketName);

  await srcBucket.file(filename).move(destBucket.file(filename));
}
