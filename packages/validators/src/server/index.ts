import { z } from "zod";

export const CreateReviewSchema = z.object({
  userId: z.string().min(0).max(255),
  restaurantId: z.number().int(),
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

export const EditReviewSchema = z.object({
  id: z.number(),
  userId: z.string().min(0).max(255),
  restaurantId: z.number().int(),
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
