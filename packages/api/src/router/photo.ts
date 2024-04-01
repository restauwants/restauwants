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
      const res = await fetch(getBaseUrl() + `/api/upload?size=${input}`);
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

  multiCreate: protectedProcedure
    .input(CreatePhotosSchemaExternal)
    .mutation(async ({ ctx, input }) => {
      input.ids;
      input.reviewId;
      const rows = [];
      for (const id of input.ids) {
        rows.push(
          PhotoSchemaDatabase.parse({
            reviewId: input.reviewId,
            id,
            createdAt: new Date(),
          }),
        );
      }
      await ctx.db.insert(schema.photo).values(rows);
    }),

  /* TODO: needs to also delete the files from the storage bucket
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(schema.photo).where(eq(schema.photo.id, input));
    }),
  */
});

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
