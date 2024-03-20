"use server";

// Imports the Google Cloud client library
import type { Message } from "@google-cloud/pubsub";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";

import { getPubSubClient, getStorage } from "./storage";

import { getBaseUrl } from "../../trpc/react"; 

const MAX_FILE_SIZE = 3 * 1024 ** 2; // 3MB

export async function getSignedUrl(
  contentLengthInBytes: number,
): Promise<[string, string]> {
  "use server";

  const storage = await getStorage();
  const bucket = storage.bucket("restauwants");

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

  /*
  // PUB/SUB notificaitons configuration
  const topic = 'my-topic';
  async function createNotification() {
    // Creates a notification
    await bucket.createNotification(topic);
  
    console.log('Notification subscription created.');
  }
  createNotification().catch(console.error);
  */

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

  const subscriptionNameOrId = "uploadedphotos-sub";
  const timeout = 60;
  void listenForMessages(subscriptionNameOrId, timeout, filename);

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
