import { z } from "zod";

import {
  restaurantAddressSchema,
  restaurantNameSchema,
  userIdSchema,
  usernameSchema,
} from "../../atoms";

export {
  ReviewSchema,
  FriendSchema,
  FriendRequestSchema,
  ProfileSchema,
  RestaurantSchema,
} from "../../db";

export const RestaurantDetailsSchema = z.object({
  name: restaurantNameSchema,
  address: restaurantAddressSchema,
});

export const RestaurantDetailsSchemaParser = z
  .object({
    result: z.object({
      name: restaurantNameSchema,
      formatted_address: restaurantAddressSchema,
    }),
  })
  .transform((data) => ({
    name: data.result.name,
    address: data.result.formatted_address,
  }));

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
