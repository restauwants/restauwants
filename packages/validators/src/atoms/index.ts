import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(2, {
    message: "Username must be at least 2 characters long",
  })
  .max(32, {
    message: "Username must be at most 32 characters long",
  })
  .regex(/^[a-z0-9_.]{2,32}$/, {
    message:
      "Username must only contain lowercase letters, numbers, underscores, and periods",
  });

export const userIdSchema = z.string().min(1).max(255);

export const restaurantIdSchema = z.string().min(1).max(255);

export const restaurantNameSchema = z.string().min(1).max(255);

export const ratingSchema = z.number().int().min(1).max(5);

export const priceSchema = z.number().min(0).max(1000000);

export const reviewTextSchema = z.string().min(0).max(255);

export const visitedAtSchema = z.date().refine((d) => d <= new Date(), {
  message: "The date of visit must be in the past",
});

export const createdAtSchema = z.date().refine((d) => d <= new Date(), {
  message: "The creation date must be in the past",
});

export const confirmedAtSchema = z.date().refine((d) => d <= new Date(), {
  message: "The confirmation date must be in the past",
});

export const updatedAtSchema = z.date().refine((d) => d <= new Date(), {
  message: "The update date must be in the past",
});

export const reviewIdSchema = z.number().int().positive();

export const restaurantAddressSchema = z.string().min(1).max(255);

export const restaurantDescriptionSchema = z.string().min(1).max(255);
