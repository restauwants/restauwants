import { schema } from "@restauwants/db";
import { RestaurantSchema } from "@restauwants/validators/db";
import { AddRestaurantSchema } from "@restauwants/validators/server/external";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const restaurantRouter = createTRPCRouter({
  create: protectedProcedure
    .input(AddRestaurantSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(schema.restaurant).values(
        RestaurantSchema.parse({
          ...input,
        }),
      );
    }),
});
