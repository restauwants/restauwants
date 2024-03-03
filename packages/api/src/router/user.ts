import { eq, schema } from "@restauwants/db";
import { UserSchemaWithOptionals } from "@restauwants/validators/server/external";

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
});
