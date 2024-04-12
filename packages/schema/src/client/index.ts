import { z } from "zod";

import {
  PriceSchema,
  RatingSchema,
  RestaurantDescriptionSchema,
  ReviewIdSchema,
  ReviewTextSchema,
  UsernameSchema,
  VisitedAtSchema,
} from "../atoms";
import { RestaurantSchema } from "../server/external";

export {
  RestaurantSchema,
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

export const RestaurantSchemaWithDescription = RestaurantSchema.extend({
  description: RestaurantDescriptionSchema,
});

export const GooglePlaceAutocompleteToRestaurantSchema = z
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

export const AddDescriptionToRestaurantSchema = RestaurantSchema.transform(
  (restaurant) => ({
    ...restaurant,
    description: `${restaurant.name}, ${restaurant.address}`,
  }),
);

export const CreateReviewFormSchema = z.object({
  restaurant: RestaurantSchema,
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
  restaurant: RestaurantSchema,
  rating: RatingSchema,
  price: PriceSchema,
  text: ReviewTextSchema,
  visitedAt: VisitedAtSchema,
});
