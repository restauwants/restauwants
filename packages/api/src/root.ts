import { authRouter } from "./router/auth";
import { collectionRouter } from "./router/collection";
import { friendRouter } from "./router/friend";
import { restaurantRouter } from "./router/restaurant";
import { reviewRouter } from "./router/review";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  review: reviewRouter,
  friend: friendRouter,
  user: userRouter,
  collection: collectionRouter,
  restaurant: restaurantRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
