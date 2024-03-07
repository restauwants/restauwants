import { authRouter } from "./router/auth";
import { collectionRouter } from "./router/collections";
import { restaurantsRouter } from "./router/restaurants";
import { reviewRouter } from "./router/review";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  review: reviewRouter,
  collections: collectionRouter,
  restaurants: restaurantsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
