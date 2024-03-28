import { edgeRouter } from "./edge";
import { nodejsRouter } from "./nodejs";
import { mergeRouters } from "./trpc";

export const appRouter = mergeRouters(edgeRouter, nodejsRouter);
// export type definition of API
export type AppRouter = typeof appRouter;
