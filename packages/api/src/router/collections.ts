import { z } from "zod";

import { desc, eq, schema } from "@restauwants/db";
import {
  AddRestaurantToCollectionFormSchema as ClientAddRestaurantToCollectionFormSchema,
  CreateCollectionSchema as ClientCreateCollectionSchema,
} from "@restauwants/validators/client";
import {
  AddRestaurantToCollectionSchema as ServerAddRestaurantToCollectionFormSchema,
  CreateCollectionSchema as ServerCreateCollectionSchema,
} from "@restauwants/validators/server";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const collectionRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.collections.findMany({
      orderBy: desc(schema.collections.id),
      limit: 10,
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.collections.findFirst({
        where: eq(schema.collections.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(ClientCreateCollectionSchema)
    .mutation(({ ctx, input }) => {
      const storable = ServerCreateCollectionSchema.parse({
        ...input,
        id: z.number(),
        userId: ctx.session.user.id,
        createdAt: new Date(),
      });
      return ctx.db.insert(schema.collections).values(storable);
    }),

  delete: protectedProcedure.input(z.number()).mutation(({ ctx, input }) => {
    return ctx.db
      .delete(schema.collections)
      .where(eq(schema.collections.id, input));
  }),

  addRestaurant: protectedProcedure
    .input(
      z.object({
        collectionId: z.number(),
        restaurantId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const storable = ServerAddRestaurantToCollectionFormSchema.parse({
        ...input,
        dateAdded: new Date(),
      });
      return ctx.db.insert(schema.collectionRestaurant).values(storable);
    }),

  deleteRestaurant: protectedProcedure
    .input(
      z.object({
        collectionId: z.number(),
        restaurantId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(schema.collectionRestaurant)
        .where(
          eq(schema.collectionRestaurant.restaurantId, input.restaurantId),
        );
    }),

  getCollection: protectedProcedure
    .input(z.object({ collectionId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.collectionRestaurant.findMany({
        where: eq(schema.collectionRestaurant.collectionId, input.collectionId),
        orderBy: desc(schema.collectionRestaurant.dateAdded),
      });
    }),

  getRestaurantName: protectedProcedure
    .input(z.object({ restaurantId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.restaurant.findFirst({
        where: eq(schema.restaurant.id, input.restaurantId),
      });
    }),
});
