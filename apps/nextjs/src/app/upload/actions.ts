"use server";

// Imports the Google Cloud client library
import path from "path";
import type { Message } from "@google-cloud/pubsub";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";

import { getPubSubClient, getStorage } from "./storage";

const MAX_FILE_SIZE = 3 * 1024 ** 2; // 3MB

// https://storage.googleapis.com/restauwants_staging/d271021f-240f-4e6b-b4c7-682f5473c156?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=restauwants-test%40nifty-edge-415820.iam.gserviceaccount.com%2F20240325%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20240325T033444Z&X-Goog-Expires=600&X-Goog-SignedHeaders=content-length%3Bcontent-type%3Bhost&X-Goog-Signature=2d5eb29615dc58433b8d58de9dcb466b159a5c892c7c089d5b49e8a2e2af2dc713649342be78451a0e0f78a6a8ce73e876d3e9075911d4257779b509b3723425137c9a5ec624ac2fab81a201ebd5aa373248182e40c9c82618420efc9ede35913eec39c3552806c329defa65eaa6e3a59ced7645dd35041659da26673505c317a641514057d90320a38bfa56e87255bd8624f1836e821c427b78f41187f3518f6db18e256d95e580c825ff3efd40ff48b5ae44914d43a26b245610202f66c1ba384ebab92ebcfe9f75c373ad2d42823a1c486dc3c0814f58fc3bb294a151141f609ffd7384adafe6fc65d78fdc5b518e6365bf265bedffd6629dca5b7f941279
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
    expires: expiry,
    extensionHeaders: { "content-length": fileSize },
    contentType: "image/jpeg", //"application/octet-stream",
  };

  const [signedUrlString] = await file.getSignedUrl(options);

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

  /*
  const subscriptionNameOrId = "uploadedphotos-sub";
  const timeout = 60;
  void listenForMessages(subscriptionNameOrId, timeout, filename);
  */

  return [url, filename];
}

// Creates a client; cache this for further use

async function listenForMessages(
  subscriptionNameOrId: string,
  timeout: number,
  expectedFilename: string,
) {
  // References an existing subscription
  const pubSubClient = await getPubSubClient();
  const subscription = pubSubClient.subscription(subscriptionNameOrId);

  // Create an event handler to handle messages
  let messageCount = 0;
  const messageHandler = (message: Message) => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log("\tAttributes: ", message.attributes);
    messageCount += 1;

    // "Ack" (acknowledge receipt of) the message
    message.ack();

    if (message.attributes.objectId === expectedFilename) {
      // Add photo id to photos table
    }
  };

  // Listen for new messages until timeout is hit

  subscription.on("message", messageHandler);

  // Wait a while for the subscription to run. (Part of the sample only.)
  setTimeout(() => {
    subscription.removeListener("message", messageHandler);
    console.log(`${messageCount} message(s) received.`);
  }, timeout * 1000);
}

function getBaseUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
