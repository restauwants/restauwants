import { z } from "zod";

import { desc, eq, schema } from "@restauwants/db";
import { CreateReviewSchema } from "@restauwants/validators";

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
    .input(CreateReviewSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(schema.review).values(input);
    }),

  delete: protectedProcedure.input(z.number()).mutation(({ ctx, input }) => {
    return ctx.db.delete(schema.review).where(eq(schema.review.id, input));
  }),
});
