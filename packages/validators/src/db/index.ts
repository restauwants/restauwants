import { z } from "zod";

import {
  confirmedAtSchema,
  createdAtSchema,
  priceSchema,
  ratingSchema,
  restaurantAddressSchema,
  restaurantIdSchema,
  restaurantNameSchema,
  reviewTextSchema,
  updatedAtSchema,
  userIdSchema,
  usernameSchema,
  visitedAtSchema,
} from "../atoms";

export const ReviewSchema = z.object({
  userId: userIdSchema,
  restaurantId: restaurantIdSchema,
  rating: ratingSchema,
  price: priceSchema,
  text: reviewTextSchema,
  visitedAt: visitedAtSchema,
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
});

export const ProfileSchema = z.object({
  id: userIdSchema,
  username: usernameSchema,
});

export const RestaurantSchema = z.object({
  id: restaurantIdSchema,
  name: restaurantNameSchema,
  address: restaurantAddressSchema,
});

export const FriendSchema = z.object({
  fromUserId: userIdSchema,
  toUserId: userIdSchema,
  confirmedAt: confirmedAtSchema,
});

export const FriendRequestSchema = z.object({
  fromUserId: userIdSchema,
  toUserId: userIdSchema,
  createdAt: createdAtSchema,
});
