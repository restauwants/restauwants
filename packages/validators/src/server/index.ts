import { z } from "zod";

export const CreateReviewSchema = z.object({
  userId: z.string().min(0).max(255),
  restaurantId: z.string(),
  rating: z.number().int().min(1).max(5),
  price: z.number().min(0).max(1000000),
  text: z.string().min(0).max(255),
  visitedAt: z.date().refine((d) => d <= new Date(), {
    message: "visitedAt must be in the past",
  }),
  createdAt: z.date().refine((d) => d <= new Date(), {
    message: "createdAt must be in the past",
  }),
  updatedAt: z.date().refine((d) => d <= new Date(), {
    message: "updatedAt must be in the past",
  }),
});

export const CreateCollectionSchema = z.object({
  userId: z.string().min(0).max(255),
  name: z.string().min(0).max(255),
  description: z.string().min(0).max(255),
  createdAt: z.date().refine((d) => d <= new Date(), {
    message: "createdAt must be in the past",
  }),
});

export const AddRestaurantToCollectionSchema = z.object({
  collectionId: z.number().int(),
  restaurantId: z.string().min(0).max(255),
  dateAdded: z.date().refine((d) => d <= new Date(), {
    message: "createdAt must be in the past",
  }),
});

export const AddRestaurantSchema = z.object({
  id: z.string(),
  name: z.string().min(0).max(255),
  website: z.string().min(0).max(255),
  formatted_phone_number: z.string().min(0).max(255),
  formatted_address: z.string().min(0).max(255),
});
