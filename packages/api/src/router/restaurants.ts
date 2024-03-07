import { schema } from "@restauwants/db";
import { AddRestaurantSchema as ClientAddRestaurantFormSchema } from "@restauwants/validators/client";
import { AddRestaurantSchema as ServerAddRestaurantFormSchema } from "@restauwants/validators/server";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const restaurantsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(ClientAddRestaurantFormSchema)
    .mutation(({ ctx, input }) => {
      const storable = ServerAddRestaurantFormSchema.parse({
        ...input,
      });
      return ctx.db.insert(schema.restaurant).values(storable);
    }),
});
