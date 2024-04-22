import { z } from "zod";

import {
  RestaurantAddressSchema,
  RestaurantNameSchema,
  UserIdSchema,
  UsernameSchema,
} from "../../atoms";

export {
  ReviewSchema,
  FriendSchema,
  FriendRequestSchema,
  ProfileSchema,
  RestaurantSchema,
} from "../../db";

export const RestaurantDetailsSchema = z.object({
  name: RestaurantNameSchema,
  address: RestaurantAddressSchema,
});

export const GooglePlaceDetailsToRestaurantDetailsSchema = z
  .object({
    result: z.object({
      name: RestaurantNameSchema,
      formatted_address: RestaurantAddressSchema,
    }),
  })
  .transform((data) => ({
    name: data.result.name,
    address: data.result.formatted_address,
  }));

export const UserSchemaWithOptionals = z.object({
  id: UserIdSchema,
  username: UsernameSchema.optional(),
});

export const UserSchema = z.object({
  id: UserIdSchema,
  username: UsernameSchema,
});

export const isCompleteUser = (
  user: z.infer<typeof UserSchemaWithOptionals>,
): user is z.infer<typeof UserSchema> => {
  return user.username !== undefined;
};
