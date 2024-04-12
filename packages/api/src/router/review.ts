import { z } from "zod";

import type { Database } from "@restauwants/db";
import type { RestaurantIdSchema } from "@restauwants/validators/atoms";
import type { RestaurantDetailsSchema } from "@restauwants/validators/server/internal";
import { alias, and, desc, eq, lt, schema } from "@restauwants/db";
import { ReviewIdSchema, UserIdSchema } from "@restauwants/validators/atoms";
import { ReviewSchema as ReviewSchemaDatabase } from "@restauwants/validators/db";
import {
  CreateReviewSchema as CreateReviewSchemaExternal,
  EditReviewSchema as EditReviewSchemaExternal,
} from "@restauwants/validators/server/external";
import { RestaurantDetailsSchemaParser } from "@restauwants/validators/server/internal";

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
          .innerJoin(
            schema.restaurant,
            eq(schema.restaurant.id, schema.review.restaurantId),
          )
          .where(where)
          .orderBy(desc(schema.review.id))
          .limit(input.limit + 1)
      ).map((r) => ({
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
      ).map((r) => ({
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
          .set({
            restaurantId: input.restaurantId,
            rating: input.rating,
            price: input.price,
            text: input.text,
            visitedAt: input.visitedAt,
            updatedAt: new Date(),
          })
          .where(eq(schema.review.id, input.id));
      };
      await withRestaurantCreationIfNecessary(
        ctx.db,
        update,
        input.restaurantId,
      );
    }),
});

const withRestaurantCreationIfNecessary = async (
  db: Database,
  statement: (db: Database) => Promise<void>,
  restaurantId: z.infer<typeof RestaurantIdSchema>,
) => {
  if (!(await doesRestaurantExist(db, restaurantId))) {
    const restaurantDetails = await getRestaurantDetails(restaurantId);
    await db.transaction(async (tx) => {
      await createRestaurant(tx, restaurantId, restaurantDetails);
      await statement(tx);
    });
  } else {
    await statement(db);
  }
};

const doesRestaurantExist = async (
  db: Database,
  restaurantId: z.infer<typeof RestaurantIdSchema>,
): Promise<boolean> => {
  return (
    (await db.query.restaurant.findFirst({
      where: eq(schema.restaurant.id, restaurantId),
    })) !== undefined
  );
};

const getRestaurantDetails = async (
  restaurantId: z.infer<typeof RestaurantIdSchema>,
): Promise<z.infer<typeof RestaurantDetailsSchema>> => {
  return fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?fields=name%2Cformatted_address&place_id=${restaurantId}&key=${process.env.GOOGLE_PLACES_API_KEY}`,
  )
    .then((res) => res.json())
    .then((json) => RestaurantDetailsSchemaParser.parse(json));
};

const createRestaurant = async (
  db: Database,
  restaurantId: z.infer<typeof RestaurantIdSchema>,
  details: z.infer<typeof RestaurantDetailsSchema>,
): Promise<void> => {
  await db.insert(schema.restaurant).values({
    id: restaurantId,
    name: details.name,
    address: details.address,
  });
};
