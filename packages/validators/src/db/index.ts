import { z } from "zod";

import {
  confirmedAtSchema,
  createdAtSchema,
  priceSchema,
  ratingSchema,
  restaurantIdSchema,
  restaurantNameSchema,
  textSchema,
  updatedAtSchema,
  userIdSchema,
  usernameSchema,
  visitedAtSchema,
} from "../common";

export const ReviewSchema = z.object({
  userId: userIdSchema,
  restaurantId: restaurantIdSchema,
  rating: ratingSchema,
  price: priceSchema,
  text: textSchema,
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
