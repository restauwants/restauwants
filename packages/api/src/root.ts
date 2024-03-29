import { edgeRouter } from "./edge";
import { nodejsRouter } from "./nodejs";
import { createTRPCRouter, mergeRouters } from "./trpc";

export const appRouter = mergeRouters(edgeRouter, nodejsRouter);
/*
export const appRouter = createTRPCRouter({
    edge: edgeRouter,
    nodejs: nodejsRouter,
})
*/
// export type definition of API
export type AppRouter = typeof appRouter;
