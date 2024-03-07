import { z } from "zod";

import { desc, eq, schema } from "@restauwants/db";
import { ReviewSchema as ReviewSchemaDatabase } from "@restauwants/validators/db";
import { CreateReviewSchema as CreateReviewSchemaExternal } from "@restauwants/validators/server/external";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const reviewRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.review.findMany({
      orderBy: desc(schema.review.id),
      limit: 10,
    });
  }),

  byId: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.review.findFirst({
        where: eq(schema.review.id, input.id),
      });
    }),

  byUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.review.findMany({
        where: eq(schema.review.userId, input.userId),
        orderBy: desc(schema.review.id),
        limit: 10,
      });
    }),

  create: protectedProcedure
    .input(CreateReviewSchemaExternal)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(schema.review).values(
        ReviewSchemaDatabase.parse({
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
      await ctx.db.delete(schema.review).where(eq(schema.review.id, input));
    }),
});
