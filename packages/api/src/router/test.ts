import { Storage } from "@google-cloud/storage";
//import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const storage = new Storage({
  projectId: "nifty-edge-415820",
  credentials: {
    client_email: process.env.GCS_CLIENT_EMAIL,
    private_key: process.env.GCS_PRIVATE_KEY?.split(String.raw`\n`).join("\n"),
  },
});

/*
export const userRouter = createTRPCRouter({
    current: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session.user.id;
        const profile = await ctx.db.query.profile.findFirst({
            where: eq(schema.profile.id, userId),
        });
        return UserSchemaExternal.parse({
            id: userId,
            username: profile?.username,
        });
    }),
});*/

export const testRouter = createTRPCRouter({
  hello: protectedProcedure.query(async ({ ctx }) => {
    const contentLengthInBytes = 3000;
    const bucket = storage.bucket("restauwants_staging");

    const origin = "localhost:3000"; //headers().get("host");
    if (origin) {
      console.log(origin);

      // set the cors configuration
      await bucket.setCorsConfiguration([
        {
          maxAgeSeconds: 3600,
          method: ["OPTIONS", "POST", "PUT", "GET"],
          origin: ["localhost:3000"],
          responseHeader: [
            "Access-Control-Allow-Origin",
            "Content-Type",
            "Vary",
          ],
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
  }),
  getSecretMessage: protectedProcedure.query(() => {
    // testing type validation of overridden next-auth Session in @restauwants/auth package
    return "you can see this secret message!";
  }),
});

const MAX_FILE_SIZE = 3 * 1024 * 1024;
