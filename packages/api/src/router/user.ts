import { eq, schema } from "@restauwants/db";
import { UserDataSchema } from "@restauwants/validators/db";
import {
  CreateProfileSchema as ExternalCreateReviewSchema,
  UserSchema,
  UserSchemaWithOptionals,
} from "@restauwants/validators/server/external";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  current: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const userData = await ctx.db.query.userData.findFirst({
      where: eq(schema.userData.id, userId),
    });
    return UserSchemaWithOptionals.parse({
      id: userId,
      username: userData?.username,
    });
  }),

  profile: createTRPCRouter({
    create: protectedProcedure
      .input(ExternalCreateReviewSchema)
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.session.user.id;
        await ctx.db.insert(schema.userData).values(
          UserDataSchema.parse({
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
