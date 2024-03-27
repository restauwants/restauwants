import { z } from "zod";

import { alias, and, desc, eq, lt, schema } from "@restauwants/db";
import { ReviewSchema as ReviewSchemaDatabase } from "@restauwants/validators/db";
import {
  CreateReviewSchema as CreateReviewSchemaExternal,
  EditReviewSchema as EditReviewSchemaExternal,
} from "@restauwants/validators/server/external";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { areFriends } from "./friend";

export const reviewRouter = createTRPCRouter({
  all: protectedProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(100).default(50),
        cursor: z.number().int().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const friendProfile = alias(schema.profile, "friendProfile");
      const where = input.cursor
        ? and(
            eq(schema.friend.toUserId, ctx.session.user.id),
            lt(schema.review.id, input.cursor),
          )
        : eq(schema.friend.toUserId, ctx.session.user.id);
      const reviews = (
        await ctx.db
          .select()
          .from(schema.review)
          .innerJoin(
            schema.friend,
            eq(schema.friend.fromUserId, schema.review.userId),
          )
          .innerJoin(friendProfile, eq(friendProfile.id, schema.review.userId))
          .where(where)
          .orderBy(desc(schema.review.id))
          .limit(input.limit + 1)
      ).map((r) => ({
        ...r.review,
        username: r.friendProfile.username,
      }));
      const hasMore = reviews.length > input.limit;
      if (hasMore) {
        reviews.pop();
      }
      return { reviews: reviews, hasMore };
    }),

  byUserId: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().int().min(1).max(100).default(50),
        cursor: z.number().int().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (
        ctx.session.user.id !== input.userId &&
        !(await areFriends(ctx.db, ctx.session.user.id, input.userId))
      ) {
        throw new Error("Not friends");
      }
      const where = input.cursor
        ? and(
            eq(schema.review.userId, input.userId),
            lt(schema.review.id, input.cursor),
          )
        : eq(schema.review.userId, input.userId);
      const reviews = (
        await ctx.db
          .select()
          .from(schema.review)
          .innerJoin(
            schema.profile,
            eq(schema.profile.id, schema.review.userId),
          )
          .where(where)
          .orderBy(desc(schema.review.id))
          .limit(input.limit + 1)
      ).map((r) => ({
        ...r.review,
        username: r.profile.username,
      }));
      const hasMore = reviews.length > input.limit;
      if (hasMore) {
        reviews.pop();
      }
      return { reviews: reviews, hasMore };
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
