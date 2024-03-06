import { eq, schema } from "@restauwants/db";
import { ProfileSchema as ProfileSchemaDatabase } from "@restauwants/validators/db";
import {
  CreateProfileSchema as CreateProfileSchemaExternal,
  UserSchema as UserSchemaExternal,
  UserSchemaWithOptionals as UserSchemaWithOptionalsExternal,
} from "@restauwants/validators/server/external";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  current: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const profile = await ctx.db.query.profile.findFirst({
      where: eq(schema.profile.id, userId),
    });
    return UserSchemaExternal.parse({
      id: userId,
      username: profile?.username,
    });
  }),

  currentWithOptionals: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const profile = await ctx.db.query.profile.findFirst({
      where: eq(schema.profile.id, userId),
    });
    return UserSchemaWithOptionalsExternal.parse({
      id: userId,
      username: profile?.username,
    });
  }),

  profile: createTRPCRouter({
    create: protectedProcedure
      .input(CreateProfileSchemaExternal)
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.session.user.id;
        await ctx.db.insert(schema.profile).values(
          ProfileSchemaDatabase.parse({
            ...input,
            id: userId,
          }),
        );
      }),
  }),
});
