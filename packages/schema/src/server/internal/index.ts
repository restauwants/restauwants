import { z } from "zod";

import {
  RestaurantAddressSchema,
  RestaurantIdSchema,
  RestaurantNameSchema,
  RestaurantUrlSchema,
  UserIdSchema,
  UsernameSchema,
} from "../../atoms";

export {
  ReviewSchema,
  FriendSchema,
  FriendRequestSchema,
  ProfileSchema,
} from "../../db";

export const RestaurantSchema = z.object({
  id: RestaurantIdSchema,
  name: RestaurantNameSchema,
  address: RestaurantAddressSchema,
  url: RestaurantUrlSchema.optional(),
});

export const RestaurantDetailsSchema = z.object({
  name: RestaurantNameSchema,
  address: RestaurantAddressSchema,
  url: RestaurantUrlSchema.optional(),
});

export const GooglePlaceDetailsToRestaurantDetailsSchema = z
  .object({
    result: z.object({
      name: RestaurantNameSchema,
      formatted_address: RestaurantAddressSchema,
      url: RestaurantUrlSchema.optional(),
    }),
  })
  .transform((data) => ({
    name: data.result.name,
    address: data.result.formatted_address,
    url: data.result.url,
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
