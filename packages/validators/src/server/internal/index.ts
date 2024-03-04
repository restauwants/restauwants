import { z } from "zod";

import { username } from "../../common";

export {
  ReviewSchema as CreateReviewSchema,
  FriendSchema as AddFriendSchema,
} from "../../db";

export const UserSchemaWithOptionals = z.object({
  id: z.string().min(0).max(255),
  username: username.optional(),
});

export const UserSchema = z.object({
  id: z.string().min(0).max(255),
  username: username,
});

export const isCompleteUser = (
  user: z.infer<typeof UserSchemaWithOptionals>,
): user is z.infer<typeof UserSchema> => {
  return user.username !== undefined;
};
