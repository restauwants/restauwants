import { desc, eq, schema } from "@restauwants/db";
import { FriendRequestSchema } from "@restauwants/validators/db";
import {
  ReceivedFriendRequestSchema,
  SentFriendRequestSchema,
} from "@restauwants/validators/server/external";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const friendRouter = createTRPCRouter({
  add: protectedProcedure
    .input(SentFriendRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const toUserId = (
        await ctx.db.query.profile.findFirst({
          where: eq(schema.profile.username, input.username),
        })
      )?.id;
      if (!toUserId) {
        throw new Error("Recipient not found");
      }
      return ctx.db
        .insert(schema.friendRequest)
        .values(
          FriendRequestSchema.parse({
            fromUserId: ctx.session.user.id,
            toUserId: toUserId,
            createdAt: new Date(),
          }),
        )
        .onDuplicateKeyUpdate({
          set: {
            createdAt: new Date(),
          },
        });
    }),

  requests: protectedProcedure.query(async ({ ctx }) => {
    const receivedFriendRequests = await ctx.db
      .select()
      .from(schema.friendRequest)
      .where(eq(schema.friendRequest.toUserId, ctx.session.user.id))
      .orderBy(desc(schema.friendRequest.createdAt))
      .limit(10)
      .innerJoin(
        schema.profile,
        eq(schema.profile.id, schema.friendRequest.fromUserId),
      );
    return receivedFriendRequests.map((r) => {
      return ReceivedFriendRequestSchema.parse({
        fromUsername: r.profile.username,
        createdAt: r.friendRequest.createdAt,
      });
    });
  }),
});
