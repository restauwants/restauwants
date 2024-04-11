import { z } from "zod";

import { userIdSchema, usernameSchema } from "../../atoms";

export {
  ReviewSchema,
  FriendSchema,
  FriendRequestSchema,
  ProfileSchema,
  RestaurantSchema,
} from "../../db";

export const UserSchemaWithOptionals = z.object({
  id: userIdSchema,
  username: usernameSchema.optional(),
});

export const UserSchema = z.object({
  id: userIdSchema,
  username: usernameSchema,
});

export const isCompleteUser = (
  user: z.infer<typeof UserSchemaWithOptionals>,
): user is z.infer<typeof UserSchema> => {
  return user.username !== undefined;
};
