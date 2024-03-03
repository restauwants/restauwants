import { z } from "zod";

export {
  CreateReviewSchema,
  AddFriendSchema,
  UserSchema,
  UserSchemaWithOptionals,
  isCompleteUser,
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
  username: z.string().min(2).max(32),
});
