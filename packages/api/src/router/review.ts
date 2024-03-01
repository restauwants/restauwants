import { z } from "zod";

import { desc, eq, schema } from "@restauwants/db";
import {
  CreateReviewSchema as ClientCreateReviewSchema,
  EditReviewSchema as ClientEditReviewSchema,
} from "@restauwants/validators/client";
import {
  CreateReviewSchema as ServerCreateReviewSchema,
  EditReviewSchema as ServerEditReviewSchema,
} from "@restauwants/validators/server";

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
    .input(ClientCreateReviewSchema)
    .mutation(({ ctx, input }) => {
      const storable = ServerCreateReviewSchema.parse({
        ...input,
        userId: ctx.session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return ctx.db.insert(schema.review).values(storable);
    }),

  update: protectedProcedure
    .input(ClientEditReviewSchema)
    .mutation(({ ctx, input }) => {
      const updatedValues = ServerEditReviewSchema.parse({
        ...input,
        userId: ctx.session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return ctx.db
        .update(schema.review)
        .set(updatedValues)
        .where(eq(schema.review.id, input.id)); //This line needs to be completed
    }),

  delete: protectedProcedure.input(z.number()).mutation(({ ctx, input }) => {
    return ctx.db.delete(schema.review).where(eq(schema.review.id, input));
  }),
});
