import { z } from "zod";

export const CreatePostSchema = z.object({
  restaurantName: z.string().min(1),
  reviewDescription: z.string().min(1),
  stars: z.number().int().max(5),
  price: z.number().min(0.0),
  date: z.date().max(new Date()).min(new Date("1900-01-01")),
  displayName: z.string().min(1),
  createdAt: z.date().max(new Date("1900-01-01")),
  updatedAt: z.date().max(new Date("1900-01-01")),
});
