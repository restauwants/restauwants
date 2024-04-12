import { z } from "zod";

import {
  PriceSchema,
  RatingSchema,
  RestaurantAddressSchema,
  RestaurantDescriptionSchema,
  RestaurantIdSchema,
  RestaurantNameSchema,
  ReviewIdSchema,
  ReviewTextSchema,
  UsernameSchema,
  VisitedAtSchema,
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

export const PlaceSchema = z.object({
  id: RestaurantIdSchema,
  address: RestaurantAddressSchema,
  name: RestaurantNameSchema,
});

export const PlaceSchemaWithDescription = PlaceSchema.extend({
  description: RestaurantDescriptionSchema,
});

export const GoogleApiToPlaceSchema = z
  .object({
    place_id: z.string(),
    structured_formatting: z.object({
      main_text: z.string(),
      secondary_text: z.string(),
    }),
  })
  .transform((place) => ({
    id: place.place_id,
    name: place.structured_formatting.main_text,
    address: place.structured_formatting.secondary_text,
  }));

export const AddPlaceDescription = PlaceSchema.transform((place) => ({
  ...place,
  description: `${place.name}, ${place.address}`,
}));

export const CreateReviewFormSchema = z.object({
  place: PlaceSchema,
  rating: RatingSchema,
  price: PriceSchema,
  text: ReviewTextSchema,
  visitedAt: VisitedAtSchema,
});

export const AddFriendFormSchema = z.object({
  username: UsernameSchema,
});

export const CreateProfileFormSchema = z.object({
  username: UsernameSchema,
});

export const EditReviewFormSchema = z.object({
  id: ReviewIdSchema,
  place: PlaceSchema,
  rating: RatingSchema,
  price: PriceSchema,
  text: ReviewTextSchema,
  visitedAt: VisitedAtSchema,
});
