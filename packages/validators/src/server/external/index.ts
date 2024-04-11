import { z } from "zod";

import {
  confirmedAtSchema,
  createdAtSchema,
  priceSchema,
  ratingSchema,
  restaurantIdSchema,
  reviewIdSchema,
  textSchema,
  usernameSchema,
  visitedAtSchema,
} from "../../atoms";

export {
  UserSchemaWithOptionals,
  UserSchema,
  isCompleteUser,
} from "../internal";

export const RemoveFriendSchema = z.object({
  username: usernameSchema,
});

export const CreateReviewSchema = z.object({
  restaurantId: restaurantIdSchema,
  rating: ratingSchema,
  price: priceSchema,
  text: textSchema,
  visitedAt: visitedAtSchema,
});

export const EditReviewSchema = z.object({
  id: reviewIdSchema,
  restaurantId: restaurantIdSchema,
  rating: ratingSchema,
  price: priceSchema,
  text: textSchema,
  visitedAt: visitedAtSchema,
});

export const ReceivedFriendRequestSchema = z.object({
  fromUsername: usernameSchema,
  createdAt: createdAtSchema,
});

export const FriendSchema = z.object({
  username: usernameSchema,
  confirmedAt: confirmedAtSchema,
});

export const AcceptFriendRequestSchema = z.object({
  fromUsername: usernameSchema,
});

export const RejectFriendRequestSchema = z.object({
  fromUsername: usernameSchema,
});

export const SentFriendRequestSchema = z.object({
  toUsername: usernameSchema,
});

export const RevokeFriendRequestSchema = z.object({
  toUsername: usernameSchema,
});

export const CreateProfileSchema = z.object({
  username: usernameSchema,
});
