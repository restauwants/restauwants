import type { Database } from "@restauwants/db";
import { alias, and, desc, eq, or, schema } from "@restauwants/db";
import { usernameToId } from "@restauwants/db/queries";
import {
  FriendRequestSchema as FriendRequestSchemaDatabase,
  FriendSchema as FriendSchemaDatabase,
} from "@restauwants/validators/db";
import {
  AcceptFriendRequestSchema as AcceptFriendRequestSchemaExternal,
  FriendSchema as FriendSchemaExternal,
  ReceivedFriendRequestSchema as ReceivedFriendRequestSchemaExternal,
  RejectFriendRequestSchema as RejectFriendRequestSchemaExternal,
  RemoveFriendSchema as RemoveFriendSchemaExternal,
  SentFriendRequestSchema as SentFriendRequestSchemaExternal,
} from "@restauwants/validators/server/external";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const friendRouter = createTRPCRouter({
  request: createTRPCRouter({
    send: protectedProcedure
      .input(SentFriendRequestSchemaExternal)
      .mutation(async ({ ctx, input }) => {
        const toUserId = await usernameToId(ctx.db, input.username);

        if (ctx.session.user.id === toUserId) {
          throw new Error("Cannot add yourself as a friend");
        }

        if (!toUserId) {
          throw new Error("Recipient not found");
        }

        if (await areFriends(ctx.db, ctx.session.user.id, toUserId)) {
          throw new Error("Already friends");
        }

        if (await hasSentFriendRequest(ctx.db, toUserId, ctx.session.user.id)) {
          await ctx.db.transaction(async (tx) => {
            await createFriendship(tx, ctx.session.user.id, toUserId);
            await deleteFriendRequestsBetween(
              tx,
              ctx.session.user.id,
              toUserId,
            );
          });
        } else {
          await sendFriendRequest(ctx.db, ctx.session.user.id, toUserId);
        }
      }),

    received: protectedProcedure.query(async ({ ctx }) => {
      const fromProfile = alias(schema.profile, "fromProfile");
      const receivedFriendRequests = await ctx.db
        .select()
        .from(schema.friendRequest)
        .where(eq(schema.friendRequest.toUserId, ctx.session.user.id))
        .orderBy(desc(schema.friendRequest.createdAt))
        .limit(10)
        .innerJoin(
          fromProfile,
          eq(fromProfile.id, schema.friendRequest.fromUserId),
        );
      return receivedFriendRequests.map((r) => {
        return ReceivedFriendRequestSchemaExternal.parse({
          fromUsername: r.fromProfile.username,
          createdAt: r.friendRequest.createdAt,
        });
      });
    }),

    accept: protectedProcedure
      .input(AcceptFriendRequestSchemaExternal)
      .mutation(async ({ ctx, input }) => {
        const fromUserId = await usernameToId(ctx.db, input.fromUsername);
        if (!fromUserId) {
          throw new Error("User not found");
        }
        await ctx.db.transaction(async (tx) => {
          await createFriendship(tx, ctx.session.user.id, fromUserId);
          await deleteFriendRequestsBetween(
            tx,
            ctx.session.user.id,
            fromUserId,
          );
        });
      }),

    reject: protectedProcedure
      .input(RejectFriendRequestSchemaExternal)
      .mutation(async ({ ctx, input }) => {
        const fromUserId = await usernameToId(ctx.db, input.fromUsername);
        if (!fromUserId) {
          throw new Error("User not found");
        }
        await deleteFriendRequest(ctx.db, fromUserId, ctx.session.user.id);
      }),
  }),

  remove: protectedProcedure
    .input(RemoveFriendSchemaExternal)
    .mutation(async ({ ctx, input }) => {
      const userId = await usernameToId(ctx.db, input.username);
      if (!userId) {
        throw new Error("User not found");
      }
      await deleteFriendship(ctx.db, ctx.session.user.id, userId);
    }),

  all: protectedProcedure.query(async ({ ctx }) => {
    const fromProfile = alias(schema.profile, "fromProfile");
    const toProfile = alias(schema.profile, "toProfile");
    const fromUserId = ctx.session.user.id;
    const friends = await ctx.db
      .select()
      .from(schema.friend)
      .where(eq(schema.friend.fromUserId, fromUserId))
      .innerJoin(fromProfile, eq(fromProfile.id, schema.friend.fromUserId))
      .innerJoin(toProfile, eq(toProfile.id, schema.friend.toUserId));
    return friends.map((f) => {
      return FriendSchemaExternal.parse({
        username: f.toProfile.username,
        confirmedAt: f.friend.confirmedAt,
      });
    });
  }),
});

export const areFriends = async (
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
  if (userIdA === userIdB) {
    throw new Error("Cannot be friends with yourself");
  }
  const now = new Date();
  const bidirectional = [
    FriendSchemaDatabase.parse({
      fromUserId: userIdA,
      toUserId: userIdB,
      confirmedAt: now,
    }),
    FriendSchemaDatabase.parse({
      fromUserId: userIdB,
      toUserId: userIdA,
      confirmedAt: now,
    }),
  ];
  await db.insert(schema.friend).values(bidirectional);
};

const deleteFriendship = async (
  db: Database,
  userIdA: string,
  userIdB: string,
): Promise<void> => {
  await db
    .delete(schema.friend)
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
    );
};

const deleteFriendRequest = async (
  db: Database,
  fromUserId: string,
  toUserId: string,
): Promise<void> => {
  await db
    .delete(schema.friendRequest)
    .where(
      and(
        eq(schema.friendRequest.fromUserId, fromUserId),
        eq(schema.friendRequest.toUserId, toUserId),
      ),
    );
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
  if (fromUserId === toUserId) {
    throw new Error("Cannot send a friend request to yourself");
  }
  const now = new Date();
  await db
    .insert(schema.friendRequest)
    .values(
      FriendRequestSchemaDatabase.parse({
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
