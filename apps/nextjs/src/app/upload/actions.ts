"use server";

import { headers } from "next/headers";
import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";

const MAX_FILE_SIZE = 3 * 1024 ** 2; // 3MB

export async function getSignedUrl(
  contentLengthInBytes: number,
): Promise<[string, string]> {
  "use server";

  const storage = new Storage({
    projectId: "nifty-edge-415820",
    credentials: {
      client_email: process.env.GCS_CLIENT_EMAIL,
      private_key: process.env.GCS_PRIVATE_KEY?.split(String.raw`\n`).join(
        "\n",
      ),
    },
  });
  const bucket = storage.bucket("restauwants");

  const origin = headers().get("host");
  if (origin) {
    console.log(origin);

    await bucket.setCorsConfiguration([
      {
        maxAgeSeconds: 3600,
        method: ["OPTIONS", "POST", "PUT", "GET"],
        origin: ["http://localhost:51903"],
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
    contentType: "image/jpeg",//"application/octet-stream",
  };

  const [url] = await file.getSignedUrl(options);

  return [url, filename];
}
