import { z } from "zod";

import type { Database } from "@restauwants/db";
import { alias, and, desc, eq, lt, schema } from "@restauwants/db";
import { ReviewIdSchema, UserIdSchema } from "@restauwants/schema/atoms";
import { ReviewSchema as ReviewSchemaDatabase } from "@restauwants/schema/db";
import {
  CreateReviewSchema as CreateReviewSchemaExternal,
  EditReviewSchema as EditReviewSchemaExternal,
  ExampleReviewSchema as ExampleReviewSchemaExternal,
  ReviewSchema as ReviewSchemaExternal,
} from "@restauwants/schema/server/external";

import { areFriends } from "../queries/friend";
import { withRestaurantCreationIfNecessary } from "../queries/review";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const reviewRouter = createTRPCRouter({
  example: createTRPCRouter({
    all: publicProcedure
      .input(
        z.object({
          limit: z.number().int().min(1).max(3).default(1),
        }),
      )
      .query(({ input }) => {
        const reviews = [
          {
            id: 1,
            text: "Awesome sandwich bar, right on campus. Has been a game changer for me on the days I don't bring a lunch. I recommend ordering the wrap and packing in all the veggies.",
            rating: 4,
            price: 10.0,
            visitedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            userId: "0",
            username: "daphne",
            restaurantId: "ChIJ_-4oJVpxj1QR9fuYXnfroNg",
            restaurantName: "Mac's",
            restaurantAddress:
              "MacLaurin Building, 3800 Finnerty Rd, Victoria, BC V8P 4X2, Canada",
            restaurantUrl: "https://maps.google.com/?cid=15609735206386858997",
          },
        ].map((r) => ExampleReviewSchemaExternal.parse(r));
        return reviews.slice(0, input.limit);
      }),
  }),

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
          .innerJoin(
            schema.restaurant,
            eq(schema.restaurant.id, schema.review.restaurantId),
          )
          .where(where)
          .orderBy(desc(schema.review.id))
          .limit(input.limit + 1)
      ).map((r) =>
        ReviewSchemaExternal.parse({
          id: r.review.id,
          text: r.review.text,
          rating: r.review.rating,
          price: r.review.price,
          visitedAt: r.review.visitedAt,
          createdAt: r.review.createdAt,
          updatedAt: r.review.updatedAt,
          userId: r.friendProfile.id,
          username: r.friendProfile.username,
          restaurantId: r.restaurant.id,
          restaurantName: r.restaurant.name,
          restaurantAddress: r.restaurant.address,
          restaurantUrl: r.restaurant.url ?? undefined,
        }),
      );
      const hasMore = reviews.length > input.limit;
      if (hasMore) {
        reviews.pop();
      }
      return { reviews: reviews, hasMore };
    }),

  byUserId: protectedProcedure
    .input(
      z.object({
        userId: UserIdSchema,
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
          .innerJoin(
            schema.restaurant,
            eq(schema.restaurant.id, schema.review.restaurantId),
          )
          .where(where)
          .orderBy(desc(schema.review.id))
          .limit(input.limit + 1)
      ).map((r) =>
        ReviewSchemaExternal.parse({
          id: r.review.id,
          text: r.review.text,
          rating: r.review.rating,
          price: r.review.price,
          visitedAt: r.review.visitedAt,
          createdAt: r.review.createdAt,
          updatedAt: r.review.updatedAt,
          userId: r.profile.id,
          username: r.profile.username,
          restaurantId: r.restaurant.id,
          restaurantName: r.restaurant.name,
          restaurantAddress: r.restaurant.address,
          restaurantUrl: r.restaurant.url ?? undefined,
        }),
      );
      const hasMore = reviews.length > input.limit;
      if (hasMore) {
        reviews.pop();
      }
      return { reviews: reviews, hasMore };
    }),

  create: protectedProcedure
    .input(CreateReviewSchemaExternal)
    .mutation(async ({ ctx, input }) => {
      const insert = async (db: Database) => {
        await db.insert(schema.review).values(
          ReviewSchemaDatabase.parse({
            ...input,
            userId: ctx.session.user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        );
      };
      await withRestaurantCreationIfNecessary(
        ctx.db,
        insert,
        input.restaurantId,
      );
    }),

  delete: protectedProcedure
    .input(ReviewIdSchema)
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
      const update = async (db: Database) => {
        await db
          .update(schema.review)
          .set(
            ReviewSchemaDatabase.partial().parse({
              restaurantId: input.restaurantId,
              rating: input.rating,
              price: input.price,
              text: input.text,
              visitedAt: input.visitedAt,
              updatedAt: new Date(),
            }),
          )
          .where(eq(schema.review.id, input.id));
      };
      await withRestaurantCreationIfNecessary(
        ctx.db,
        update,
        input.restaurantId,
      );
    }),
});
