import { authRouter } from "./router/auth";
import { reviewRouter } from "./router/review";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  review: reviewRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
