import { z } from "zod";

import { username } from "../../common";

export {
  UserSchemaWithOptionals,
  UserSchema,
  isCompleteUser,
} from "../internal";

export const RemoveFriendSchema = z.object({
  username: username,
});

export const CreateReviewSchema = z.object({
  restaurantId: z.number().int().positive(),
  rating: z.number().int().max(5).positive(),
  price: z.number().max(1000000).positive(),
  text: z.string().min(0).max(255),
  visitedAt: z.date().refine((d) => d <= new Date(), {
    message: "updatedAt must be in the past",
  }),
});

export const ReceivedFriendRequestSchema = z.object({
  fromUsername: username,
  createdAt: z.date().refine((d) => d <= new Date(), {
    message: "createdAt must be in the past",
  }),
});

export const FriendSchema = z.object({
  username: username,
  confirmedAt: z.date().refine((d) => d <= new Date(), {
    message: "createdAt must be in the past",
  }),
});

export const AcceptFriendRequestSchema = z.object({
  fromUsername: username,
});

export const RejectFriendRequestSchema = z.object({
  fromUsername: username,
});

export const SentFriendRequestSchema = z.object({
  username: username,
});

export const CreateProfileSchema = z.object({
  username: username,
});

// export const CancelFriendRequestSchema = z.object({
//   username: username,
// });
