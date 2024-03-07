import { z } from "zod";

export const username = z
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
