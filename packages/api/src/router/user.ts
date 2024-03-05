import { eq, schema } from "@restauwants/db";
import { ProfileSchema } from "@restauwants/validators/db";
import {
  CreateProfileSchema as ExternalCreateReviewSchema,
  UserSchema,
  UserSchemaWithOptionals,
} from "@restauwants/validators/server/external";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  current: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const profile = await ctx.db.query.profile.findFirst({
      where: eq(schema.profile.id, userId),
    });
    return UserSchema.parse({
      id: userId,
      username: profile?.username,
    });
  }),

  currentWithOptionals: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const profile = await ctx.db.query.profile.findFirst({
      where: eq(schema.profile.id, userId),
    });
    return UserSchemaWithOptionals.parse({
      id: userId,
      username: profile?.username,
    });
  }),

  profile: createTRPCRouter({
    create: protectedProcedure
      .input(ExternalCreateReviewSchema)
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.session.user.id;
        await ctx.db.insert(schema.profile).values(
          ProfileSchema.parse({
            ...input,
            id: userId,
          }),
        );
        return UserSchema.parse({
          id: userId,
          username: input.username,
        });
      }),
  }),
});
