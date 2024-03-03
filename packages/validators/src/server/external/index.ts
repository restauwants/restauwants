import { z } from "zod";

export {
  UserSchemaWithOptionals,
  UserSchema,
  isCompleteUser,
} from "../internal";

export const CreateReviewSchema = z.object({
  restaurantId: z.number().int().positive(),
  rating: z.number().int().max(5).positive(),
  price: z.number().max(1000000).positive(),
  text: z.string().min(0).max(255),
  visitedAt: z.date().refine((d) => d <= new Date(), {
    message: "updatedAt must be in the past",
  }),
});

export const AddFriendSchema = z.object({
  username: z.string().min(2).max(32),
});
