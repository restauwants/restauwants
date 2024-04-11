import { z } from "zod";

import {
  priceSchema,
  ratingSchema,
  restaurantIdSchema,
  reviewIdSchema,
  textSchema,
  usernameSchema,
  visitedAtSchema,
} from "../atoms";

export {
  UserSchemaWithOptionals,
  UserSchema,
  isCompleteUser,
  RemoveFriendSchema,
  CreateReviewSchema,
  EditReviewSchema,
  ReceivedFriendRequestSchema,
  FriendSchema,
  AcceptFriendRequestSchema,
  RejectFriendRequestSchema,
  SentFriendRequestSchema,
  RevokeFriendRequestSchema,
  CreateProfileSchema,
} from "../server/external";

export const CreateReviewFormSchema = z.object({
  restaurantId: restaurantIdSchema,
  rating: ratingSchema,
  price: priceSchema,
  text: textSchema,
  visitedAt: visitedAtSchema,
});

export const AddFriendFormSchema = z.object({
  username: usernameSchema,
});

export const CreateProfileFormSchema = z.object({
  username: usernameSchema,
});

export const EditReviewFormSchema = z.object({
  id: reviewIdSchema,
  restaurantId: restaurantIdSchema,
  rating: ratingSchema,
  price: priceSchema,
  text: textSchema,
  visitedAt: visitedAtSchema,
});
