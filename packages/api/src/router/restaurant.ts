import { z } from "zod";

import { desc, eq, schema } from "@restauwants/db";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const restaurantRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.restaurant.findMany({
      orderBy: desc(schema.restaurant.id),
      limit: 10,
    });
  }),
  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.restaurant.findFirst({
        where: eq(schema.restaurant.id, input.id),
      });
    }),
});
