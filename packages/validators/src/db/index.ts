import { z } from "zod";

import { username } from "../common";

export const ReviewSchema = z.object({
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

export const FriendSchema = z.object({
  fromUserId: z.string().min(0).max(255),
  toUserId: z.string().min(0).max(255),
  confirmedAt: z.date().refine((d) => d <= new Date(), {
    message: "createdAt must be in the past",
  }),
});

export const FriendRequestSchema = z.object({
  fromUserId: z.string().min(0).max(255),
  toUserId: z.string().min(0).max(255),
  createdAt: z.date().refine((d) => d <= new Date(), {
    message: "createdAt must be in the past",
  }),
});

export const UserSchema = z.object({
  id: z.string().min(0).max(255),
});

export const ProfileSchema = z.object({
  id: z.string().min(0).max(255),
  username: username,
});

export const PhotoSchema = z.object({
  reviewId: z.number().int(),
  photoId: z.string().uuid(),
  createdAt: z.date().refine((d) => d <= new Date(), {
    message: "createdAt must be in the past",
  }),
});