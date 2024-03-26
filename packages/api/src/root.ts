import { authRouter } from "./router/auth";
import { friendRouter } from "./router/friend";
import { photoRouter } from "./router/photo";
import { reviewRouter } from "./router/review";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  review: reviewRouter,
  friend: friendRouter,
  user: userRouter,
  photo: photoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
