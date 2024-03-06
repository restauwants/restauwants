import { z } from "zod";

import { desc, eq, schema } from "@restauwants/db";
import { ReviewSchema } from "@restauwants/validators/db";
import { CreateReviewSchema as ExternalCreateReviewSchema } from "@restauwants/validators/server/external";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const reviewRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.review.findMany({
      orderBy: desc(schema.review.id),
      limit: 10,
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.review.findFirst({
        where: eq(schema.review.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(ExternalCreateReviewSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(schema.review).values(
        ReviewSchema.parse({
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
