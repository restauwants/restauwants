import { z } from "zod";

import { desc, eq, schema } from "@restauwants/db";
import { CreatePhotoSchema as ClientCreatePhotoSchema } from "@restauwants/validators/client";
import { CreatePhotoSchema as ServerCreatePhotoSchema } from "@restauwants/validators/server";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const photoRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.photo.findMany({
      orderBy: desc(schema.photo.id),
      limit: 10,
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.photo.findFirst({
        where: eq(schema.photo.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(ClientCreatePhotoSchema)
    .mutation(({ ctx, input }) => {
      const storable = ServerCreatePhotoSchema.parse({
        ...input,
        userId: ctx.session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return ctx.db.insert(schema.photo).values(storable);
    }),

  delete: protectedProcedure.input(z.number()).mutation(({ ctx, input }) => {
    return ctx.db.delete(schema.photo).where(eq(schema.photo.id, input));
  }),
});
