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
  ReviewIdSchema,
  ReviewTextSchema,
  UpdatedAtSchema,
  UserIdSchema,
  UsernameSchema,
  VisitedAtSchema,
} from "../../atoms";

export {
  RestaurantSchema,
  UserSchemaWithOptionals,
  UserSchema,
  isCompleteUser,
} from "../internal";

export const RemoveFriendSchema = z.object({
  username: UsernameSchema,
});

export const ReviewSchema = z.object({
  id: ReviewIdSchema,
  text: ReviewTextSchema,
  rating: RatingSchema,
  price: PriceSchema,
  visitedAt: VisitedAtSchema,
  createdAt: CreatedAtSchema,
  updatedAt: UpdatedAtSchema,
  userId: UserIdSchema,
  username: UsernameSchema,
  restaurantId: RestaurantIdSchema,
  restaurantName: RestaurantNameSchema,
  restaurantAddress: RestaurantAddressSchema,
  restaurantUrl: RestaurantUrlSchema.optional(),
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
