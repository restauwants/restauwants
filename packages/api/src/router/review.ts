import { z } from "zod";

import { alias, desc, eq, schema } from "@restauwants/db";
import { ReviewSchema as ReviewSchemaDatabase } from "@restauwants/validators/db";
import {
  CreateReviewSchema as CreateReviewSchemaExternal,
  EditReviewSchema as EditReviewSchemaExternal,
} from "@restauwants/validators/server/external";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { areFriends } from "./friend";

export const reviewRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const friendProfile = alias(schema.profile, "friendProfile");
    return (
      await ctx.db
        .select()
        .from(schema.review)
        .innerJoin(
          schema.friend,
          eq(schema.friend.fromUserId, schema.review.userId),
        )
        .innerJoin(friendProfile, eq(friendProfile.id, schema.review.userId))
        .where(eq(schema.friend.toUserId, ctx.session.user.id))
        .orderBy(desc(schema.review.id))
        .limit(10)
    ).map((r) => ({
      ...r.review,
      username: r.friendProfile.username,
    }));
  }),

  byUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (
        ctx.session.user.id !== input.userId &&
        !(await areFriends(ctx.db, ctx.session.user.id, input.userId))
      ) {
        throw new Error("Not friends");
      }
      return (
        await ctx.db
          .select()
          .from(schema.review)
          .innerJoin(
            schema.profile,
            eq(schema.profile.id, schema.review.userId),
          )
          .where(eq(schema.review.userId, input.userId))
          .orderBy(desc(schema.review.id))
          .limit(10)
      ).map((r) => ({
        ...r.review,
        username: r.profile.username,
      }));
    }),

  create: protectedProcedure
    .input(CreateReviewSchemaExternal)
    .mutation(async ({ ctx, input }) => {
      // create the review
      const reviewTable = await ctx.db.insert(schema.review).values(
        ReviewSchemaDatabase.parse({
          ...input,
          userId: ctx.session.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      );

      return parseInt(reviewTable.insertId);
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.db.query.review.findFirst({
        where: eq(schema.review.id, input),
      });
      if (!review) {
        throw new Error("Review not found");
      }
      if (review.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }
      await ctx.db.delete(schema.review).where(eq(schema.review.id, input));
    }),

  update: protectedProcedure
    .input(EditReviewSchemaExternal)
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.db.query.review.findFirst({
        where: eq(schema.review.id, input.id),
      });
      if (!review) {
        throw new Error("Review not found");
      }
      if (review.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }
      return ctx.db
        .update(schema.review)
        .set({
          restaurantId: input.restaurantId,
          rating: input.rating,
          price: input.price,
          text: input.text,
          visitedAt: input.visitedAt,
          updatedAt: new Date(),
        })
        .where(eq(schema.review.id, input.id));
    }),
});
