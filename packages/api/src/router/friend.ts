import type { Database } from "@restauwants/db";
import { and, desc, eq, or, schema } from "@restauwants/db";
import { usernameToId } from "@restauwants/db/queries";
import { FriendRequestSchema, FriendSchema } from "@restauwants/validators/db";
import {
  ReceivedFriendRequestSchema,
  SentFriendRequestSchema,
} from "@restauwants/validators/server/external";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const friendRouter = createTRPCRouter({
  add: protectedProcedure
    .input(SentFriendRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const toUserId = await usernameToId(ctx.db, input.username);

      if (!toUserId) {
        throw new Error("Recipient not found");
      }

      if (await areFriends(ctx.db, ctx.session.user.id, toUserId)) {
        throw new Error("Already friends");
      }

      if (await hasSentFriendRequest(ctx.db, toUserId, ctx.session.user.id)) {
        await ctx.db.transaction(async (tx) => {
          await createFriendship(tx, ctx.session.user.id, toUserId);
          await deleteFriendRequestsBetween(tx, ctx.session.user.id, toUserId);
        });
      } else {
        await sendFriendRequest(ctx.db, ctx.session.user.id, toUserId);
      }
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

const areFriends = async (
  db: Database,
  userIdA: string,
  userIdB: string,
): Promise<boolean> => {
  return (
    (
      await db
        .select()
        .from(schema.friend)
        .where(
          or(
            and(
              eq(schema.friend.fromUserId, userIdA),
              eq(schema.friend.toUserId, userIdB),
            ),
            and(
              eq(schema.friend.fromUserId, userIdB),
              eq(schema.friend.toUserId, userIdA),
            ),
          ),
        )
    ).length > 0
  );
};

const hasSentFriendRequest = async (
  db: Database,
  fromUserId: string,
  toUserId: string,
): Promise<boolean> => {
  return (
    (
      await db
        .select()
        .from(schema.friendRequest)
        .where(
          and(
            eq(schema.friendRequest.fromUserId, fromUserId),
            eq(schema.friendRequest.toUserId, toUserId),
          ),
        )
    ).length > 0
  );
};

const createFriendship = async (
  db: Database,
  userIdA: string,
  userIdB: string,
): Promise<void> => {
  const now = new Date();
  const bidirectional = [
    FriendSchema.parse({
      fromUserId: userIdA,
      toUserId: userIdB,
      confirmedAt: now,
    }),
    FriendSchema.parse({
      fromUserId: userIdB,
      toUserId: userIdA,
      confirmedAt: now,
    }),
  ];
  await db.insert(schema.friend).values(bidirectional);
};

const deleteFriendRequestsBetween = async (
  db: Database,
  userIdA: string,
  userIdB: string,
): Promise<void> => {
  await db
    .delete(schema.friendRequest)
    .where(
      or(
        and(
          eq(schema.friendRequest.fromUserId, userIdA),
          eq(schema.friendRequest.toUserId, userIdB),
        ),
        and(
          eq(schema.friendRequest.fromUserId, userIdB),
          eq(schema.friendRequest.toUserId, userIdA),
        ),
      ),
    );
};

const sendFriendRequest = async (
  db: Database,
  fromUserId: string,
  toUserId: string,
): Promise<void> => {
  const now = new Date();
  await db
    .insert(schema.friendRequest)
    .values(
      FriendRequestSchema.parse({
        fromUserId,
        toUserId,
        createdAt: now,
      }),
    )
    .onDuplicateKeyUpdate({
      set: {
        createdAt: now,
      },
    });
};
