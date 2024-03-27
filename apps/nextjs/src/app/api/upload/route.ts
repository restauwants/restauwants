import { v4 as uuidv4 } from "uuid";

import type { NextRequest } from "next/server";

import { headers } from "next/headers";


import { Storage } from "@google-cloud/storage";

const MAX_FILE_SIZE = 3 * 1024 * 1024 // 3 MB

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


export async function GET(request: NextRequest) {

  const { searchParams } = request.nextUrl;


  const file = searchParams.get("file");


  if (!file) {

    return Response.json(

      { error: "File query parameter is required" },

      { status: 400 }

    );

  }


    const url = await getSignedUrl(1024);


  return Response.json({ presignedUrl: url });

}

export async function getSignedUrl(
    contentLengthInBytes: number,
  ): Promise<[string, string]> {
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

  