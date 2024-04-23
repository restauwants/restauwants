import type { z } from "zod";

import type { Database } from "@restauwants/db";
import type { UserIdSchema } from "@restauwants/schema/atoms";
import { and, eq, or, schema } from "@restauwants/db";
import {
  FriendRequestSchema as FriendRequestSchemaDatabase,
  FriendSchema as FriendSchemaDatabase,
} from "@restauwants/schema/db";

export const areFriends = async (
  db: Database,
  userIdA: z.infer<typeof UserIdSchema>,
  userIdB: z.infer<typeof UserIdSchema>,
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

export const hasSentFriendRequest = async (
  db: Database,
  fromUserId: z.infer<typeof UserIdSchema>,
  toUserId: z.infer<typeof UserIdSchema>,
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

export const createFriendship = async (
  db: Database,
  userIdA: z.infer<typeof UserIdSchema>,
  userIdB: z.infer<typeof UserIdSchema>,
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

export const deleteFriendship = async (
  db: Database,
  userIdA: z.infer<typeof UserIdSchema>,
  userIdB: z.infer<typeof UserIdSchema>,
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

export const deleteFriendRequest = async (
  db: Database,
  fromUserId: z.infer<typeof UserIdSchema>,
  toUserId: z.infer<typeof UserIdSchema>,
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

export const deleteFriendRequestsBetween = async (
  db: Database,
  userIdA: z.infer<typeof UserIdSchema>,
  userIdB: z.infer<typeof UserIdSchema>,
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

export const sendFriendRequest = async (
  db: Database,
  fromUserId: z.infer<typeof UserIdSchema>,
  toUserId: z.infer<typeof UserIdSchema>,
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
