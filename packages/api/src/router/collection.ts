import { z } from "zod";

import { desc, eq, schema } from "@restauwants/db";
import { CreateCollectionSchema as ClientCreateCollectionSchema } from "@restauwants/validators/client";
import {
  AddRestaurantToCollectionSchema as ServerAddRestaurantToCollectionFormSchema,
  CreateCollectionSchema as ServerCreateCollectionSchema,
} from "@restauwants/validators/server/external";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const collectionRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.collection.findMany({
      orderBy: desc(schema.collection.id),
      limit: 10,
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.collection.findFirst({
        where: eq(schema.collection.id, input.id),
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
      return ctx.db.insert(schema.collection).values(storable);
    }),

  delete: protectedProcedure.input(z.number()).mutation(({ ctx, input }) => {
    return ctx.db
      .delete(schema.collection)
      .where(eq(schema.collection.id, input));
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
      return ctx.db.insert(schema.collectionHasRestaurant).values(storable);
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
        .delete(schema.collectionHasRestaurant)
        .where(
          eq(schema.collectionHasRestaurant.restaurantId, input.restaurantId),
        );
    }),

  getCollection: protectedProcedure
    .input(z.object({ collectionId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.collectionHasRestaurant.findMany({
        where: eq(
          schema.collectionHasRestaurant.collectionId,
          input.collectionId,
        ),
        orderBy: desc(schema.collectionHasRestaurant.dateAdded),
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
