import { schema } from "@restauwants/db";
import { AddFriendSchema as ClientAddFriendSchema } from "@restauwants/validators/client";
import { AddFriendSchema as ServerAddFriendSchema } from "@restauwants/validators/server";

import { usernameToId } from "../common/user";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const friendRouter = createTRPCRouter({
  add: protectedProcedure
    .input(ClientAddFriendSchema)
    .mutation(async ({ ctx, input }) => {
      const toUserId = await usernameToId(input.username, ctx.db);
      const storable = ServerAddFriendSchema.parse({
        fromUserId: ctx.session.user.id,
        toUserId: toUserId,
        createdAt: new Date(),
      });
      return ctx.db.insert(schema.friendRequest).values(storable);
    }),
});
