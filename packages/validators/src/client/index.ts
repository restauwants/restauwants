import { z } from "zod";

import { username } from "../common";

export {
  UserSchemaWithOptionals,
  UserSchema,
  isCompleteUser,
  CreateReviewSchema,
  ReceivedFriendRequestSchema,
  SentFriendRequestSchema,
  CreateProfileSchema,
  AcceptFriendRequestSchema,
} from "../server/external";

export const CreateReviewFormSchema = z.object({
  restaurantId: z.string().pipe(z.coerce.number().int().positive()),
  rating: z.string().pipe(z.coerce.number().int().max(5).positive()),
  price: z.string().pipe(z.coerce.number().max(1000000).positive()),
  text: z.string().min(0).max(255),
  visitedAt: z.string().pipe(
    z.coerce.date().refine((d) => d <= new Date(), {
      message: "visitedAt must be in the past",
    }),
  ),
});

export const AddFriendFormSchema = z.object({
  username: username,
});

export const CreateProfileFormSchema = z.object({
  username: username,
});
