import { z } from "zod";

import { /*eq,*/ schema } from "@restauwants/db";
import { PhotoSchema as PhotoSchemaDatabase } from "@restauwants/validators/db";
import { CreatePhotosSchema as CreatePhotosSchemaExternal } from "@restauwants/validators/server/external";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const photoRouter = createTRPCRouter({
  getSignedUrl: protectedProcedure
    .input(
      z
        .number()
        .nonnegative()
        .lt(3 * 1024 * 1024),
    )
    .query(async ({ ctx, input }) => {
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
      // verify signedUrls and size are same length
      const filenames = [] as string[];
      for (let i = 0; i < input.signedUrls.length; i++) {
        const signedUrl = input.signedUrls[i];
        const size = input.sizes[i];
        if (!signedUrl || !size) {
          throw new Error("signedUrl and size query parameters are required");
        }
        const res = await fetch(
          getBaseUrl() +
            `/api/photo?action=move&signedUrl=${encodeURIComponent(
              signedUrl,
            )}&size=${size}`,
        );

        const { success } = (await res.json()) as { success: boolean };
        if (success) {
          // We are safe here because the url was verified by move in the fetch above
          const url = new URL(signedUrl);
          const filename = url.pathname.split("/").pop();
          if (filename) {
            filenames.push(filename);
          }
        }
      }
      addPhotosToReviewInDB(ctx, input.reviewId, filenames);
    }),

  /* TODO: needs to also delete the files from the storage bucket
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(schema.photo).where(eq(schema.photo.id, input));
    }),
  */
});

async function addPhotosToReviewInDB(
  ctx,
  reviewId: number,
  photoIds: string[],
) {
  const rows = [];
  for (const id of photoIds) {
    rows.push(
      PhotoSchemaDatabase.parse({
        reviewId: reviewId,
        id,
        createdAt: new Date(),
      }),
    );
  }
  await ctx.db.insert(schema.photo).values(rows);
}

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
