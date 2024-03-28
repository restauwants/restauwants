import { testRouter } from "./router/test";
import { createTRPCRouter } from "./trpc";

export const nodejsRouter = createTRPCRouter({
  test: testRouter,
});
