import { z } from "zod";

export const UsernameSchema = z
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

export const UserIdSchema = z.string().min(1).max(255);

export const RestaurantIdSchema = z.string().min(1).max(255);

export const RestaurantNameSchema = z.string().min(1).max(255);

export const RatingSchema = z.number().int().min(1).max(5);

export const PriceSchema = z
  .number()
  .min(0)
  .max(1000000)
  .refine((p) => (p.toString().split(".")[1]?.length ?? 0) <= 2, {
    message: "Price must not have more than 2 decimal places",
  });

export const ReviewTextSchema = z.string().min(0).max(255);

const isDateBefore = (maximum: Date) => (date: Date) => date <= maximum;
const isDateInThePast = (date: Date) => isDateBefore(new Date())(date);
const isDateAfter = (minimum: Date) => (date: Date) => date >= minimum;
const startOfYear2000 = new Date("2000-01-01");

export const VisitedAtSchema = z
  .date()
  .refine(isDateInThePast, {
    message: "The date of visit must be in the past",
  })
  .refine(isDateAfter(startOfYear2000), {
    message: "The date of visit must be after the start of year 2000",
  });

export const CreatedAtSchema = z
  .date()
  .refine(isDateInThePast, {
    message: "The creation date must be in the past",
  })
  .refine(isDateAfter(startOfYear2000), {
    message: "The creation date must be after the start of year 2000",
  });

export const ConfirmedAtSchema = z
  .date()
  .refine(isDateInThePast, {
    message: "The confirmation date must be in the past",
  })
  .refine(isDateAfter(startOfYear2000), {
    message: "The confirmation date must be after the start of year 2000",
  });

export const UpdatedAtSchema = z
  .date()
  .refine(isDateInThePast, {
    message: "The update date must be in the past",
  })
  .refine(isDateAfter(startOfYear2000), {
    message: "The update date must be after the start of year 2000",
  });

export const ReviewIdSchema = z.number().int().positive();

export const RestaurantAddressSchema = z.string().min(1).max(255);

export const RestaurantDescriptionSchema = z.string().min(1).max(255);
