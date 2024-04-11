import { z } from "zod";

import {
  priceSchema,
  ratingSchema,
  restaurantAddressSchema,
  restaurantDescriptionSchema,
  restaurantIdSchema,
  restaurantNameSchema,
  reviewIdSchema,
  reviewTextSchema,
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

export const PlaceSchema = z.object({
  id: restaurantIdSchema,
  address: restaurantAddressSchema,
  name: restaurantNameSchema,
});

export const PlaceSchemaWithDescription = PlaceSchema.extend({
  description: restaurantDescriptionSchema,
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
  rating: ratingSchema,
  price: priceSchema,
  text: reviewTextSchema,
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
  place: PlaceSchema,
  rating: ratingSchema,
  price: priceSchema,
  text: reviewTextSchema,
  visitedAt: visitedAtSchema,
});
