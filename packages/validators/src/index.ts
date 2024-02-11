import { z } from "zod";

export const CreatePostSchema = z.object({
  restaurantName: z.string().min(1),
  reviewDescription: z.string().min(1),
  stars: z.number().int().max(5),
  price: z.number().min(0.0),
});
