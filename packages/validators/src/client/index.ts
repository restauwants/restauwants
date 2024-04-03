import { z } from "zod";

import { username } from "../common";

export {
  UserSchemaWithOptionals,
  UserSchema,
  isCompleteUser,
  RemoveFriendSchema,
  CreateReviewSchema,
  CreatePhotosSchema,
  EditReviewSchema,
  FriendSchema,
  ReceivedFriendRequestSchema,
  SentFriendRequestSchema,
  CreateProfileSchema,
  AcceptFriendRequestSchema,
  RejectFriendRequestSchema,
  RevokeFriendRequestSchema,
} from "../server/external";

export const CreateReviewFormSchema = z.object({
  restaurantId: z.string(),
  name: z.string(),
  rating: z.string().pipe(z.coerce.number().int().max(5).positive()),
  price: z.string().pipe(z.coerce.number().max(1000000).positive()),
  text: z.string().min(0).max(255),
  visitedAt: z.date().refine((d) => d <= new Date(), {
    message: "visitedAt must be in the past",
  }),
  files: z
    .custom<Blob>((value) => value instanceof Blob, {
      message: "File must be a blob",
    })
    .array()
    .max(7)
    .refine(
      (files) => {
        for (const file of files) {
          if (file.size === 0 || file.size > 5 * 1024 * 1024) {
            return false;
          }
        }
        return true;
      },
      { message: "file size must be a postive number less than 5MB" },
    ),
});

export const AddFriendFormSchema = z.object({
  username: username,
});

export const CreateProfileFormSchema = z.object({
  username: username,
});

export const EditReviewFormSchema = z.object({
  id: z.string().pipe(z.coerce.number().int().positive()),
  restaurantId: z.string(),
  name: z.string(),
  rating: z.string().pipe(z.coerce.number().int().max(5).positive()),
  price: z.string().pipe(z.coerce.number().max(1000000).positive()),
  text: z.string().min(0).max(255),
  visitedAt: z.date().refine((d) => d <= new Date(), {
    message: "visitedAt must be in the past",
  }),
});
