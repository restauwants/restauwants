"use server";

import { Storage } from "@google-cloud/storage";

export async function getStorage() {
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
