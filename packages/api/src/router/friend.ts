import { eq, schema } from "@restauwants/db";
import { FriendSchema } from "@restauwants/validators/db";
import { AddFriendSchema as ExternalAddFriendSchema } from "@restauwants/validators/server/external";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const friendRouter = createTRPCRouter({
  add: protectedProcedure
    .input(ExternalAddFriendSchema)
    .mutation(async ({ ctx, input }) => {
      const toUserId = (
        await ctx.db.query.userData.findFirst({
          where: eq(schema.userData.username, input.username),
        })
      )?.id;
      if (!toUserId) {
        throw new Error("Recipient not found");
      }
      return ctx.db.insert(schema.friendRequest).values(
        FriendSchema.parse({
          fromUserId: ctx.session.user.id,
          toUserId: toUserId,
          createdAt: new Date(),
        }),
      );
    }),
});
