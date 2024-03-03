import { z } from "zod";

export {
  ReviewSchema as CreateReviewSchema,
  FriendSchema as AddFriendSchema,
} from "../../db";

export const UserSchemaWithOptionals = z.object({
  id: z.string().min(0).max(255),
  username: z.string().min(2).max(32).optional(),
});

export const UserSchema = z.object({
  id: z.string().min(0).max(255),
  username: z.string().min(2).max(32),
});

export const isCompleteUser = (
  user: z.infer<typeof UserSchemaWithOptionals>,
): user is z.infer<typeof UserSchema> => {
  return user.username !== undefined;
};
