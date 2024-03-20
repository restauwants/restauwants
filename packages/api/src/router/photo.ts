import { z } from "zod";

import { desc, eq, schema } from "@restauwants/db";
import { PhotoSchema as PhotoSchemaDatabase } from "@restauwants/validators/db";
import { CreatePhotoSchema as CreatePhotoSchemaExternal } from "@restauwants/validators/server/external";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const photoRouter = createTRPCRouter({
  /*
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.photo.findMany({
      orderBy: desc(schema.photo.id),
      limit: 10,
    });
  }),

  byId: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.photo.findFirst({
        where: eq(schema.photo.id, input.id),
      });
    }),

  byUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.photo.findMany({
        where: eq(schema.photo.userId, input.userId),
        orderBy: desc(schema.photo.id),
        limit: 10,
      });
    }),
  */

  create: protectedProcedure
    .input(CreatePhotoSchemaExternal)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(schema.photo).values(
        PhotoSchemaDatabase.parse({
          ...input,
          userId: ctx.session.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      );
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(schema.photo).where(eq(schema.photo.id, input));
    }),
});
