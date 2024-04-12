import { z } from "zod";

import {
  ConfirmedAtSchema,
  CreatedAtSchema,
  PriceSchema,
  RatingSchema,
  RestaurantIdSchema,
  ReviewIdSchema,
  ReviewTextSchema,
  UsernameSchema,
  VisitedAtSchema,
} from "../../atoms";

export {
  UserSchemaWithOptionals,
  UserSchema,
  isCompleteUser,
} from "../internal";

export const RemoveFriendSchema = z.object({
  username: UsernameSchema,
});

export const CreateReviewSchema = z.object({
  restaurantId: RestaurantIdSchema,
  rating: RatingSchema,
  price: PriceSchema,
  text: ReviewTextSchema,
  visitedAt: VisitedAtSchema,
});

export const EditReviewSchema = z.object({
  id: ReviewIdSchema,
  restaurantId: RestaurantIdSchema,
  rating: RatingSchema,
  price: PriceSchema,
  text: ReviewTextSchema,
  visitedAt: VisitedAtSchema,
});

export const ReceivedFriendRequestSchema = z.object({
  fromUsername: UsernameSchema,
  createdAt: CreatedAtSchema,
});

export const FriendSchema = z.object({
  username: UsernameSchema,
  confirmedAt: ConfirmedAtSchema,
});

export const AcceptFriendRequestSchema = z.object({
  fromUsername: UsernameSchema,
});

export const RejectFriendRequestSchema = z.object({
  fromUsername: UsernameSchema,
});

export const SentFriendRequestSchema = z.object({
  toUsername: UsernameSchema,
});

export const RevokeFriendRequestSchema = z.object({
  toUsername: UsernameSchema,
});

export const CreateProfileSchema = z.object({
  username: UsernameSchema,
});
