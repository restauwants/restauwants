import { createTRPCClient, loggerLink } from "@trpc/client";

import type { AppRouter } from "@restauwants/api";

import { endingLink  } from "./shared";

import superjson from "superjson";

export const api = createTRPCClient<AppRouter>({
  transformer: superjson,
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === "development" ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    endingLink({
      headers: {
        "x-trpc-source": "client",
      },
    }),
  ],
});

export { type RouterInputs, type RouterOutputs } from "@restauwants/api";