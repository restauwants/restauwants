import { z } from "zod";

import {
  ConfirmedAtSchema,
  CreatedAtSchema,
  PriceSchema,
  RatingSchema,
  RestaurantAddressSchema,
  RestaurantIdSchema,
  RestaurantNameSchema,
  RestaurantUrlSchema,
  ReviewTextSchema,
  UpdatedAtSchema,
  UserIdSchema,
  UsernameSchema,
  VisitedAtSchema,
} from "../atoms";

export const ReviewSchema = z.object({
  userId: UserIdSchema,
  restaurantId: RestaurantIdSchema,
  rating: RatingSchema,
  price: PriceSchema,
  text: ReviewTextSchema,
  visitedAt: VisitedAtSchema,
  createdAt: CreatedAtSchema,
  updatedAt: UpdatedAtSchema,
});

export const ProfileSchema = z.object({
  id: UserIdSchema,
  username: UsernameSchema,
});

export const RestaurantSchema = z.object({
  id: RestaurantIdSchema,
  name: RestaurantNameSchema,
  address: RestaurantAddressSchema,
  url: RestaurantUrlSchema.nullable(),
});

export const FriendSchema = z.object({
  fromUserId: UserIdSchema,
  toUserId: UserIdSchema,
  confirmedAt: ConfirmedAtSchema,
});

export const FriendRequestSchema = z.object({
  fromUserId: UserIdSchema,
  toUserId: UserIdSchema,
  createdAt: CreatedAtSchema,
});
