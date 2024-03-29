import { headers } from "next/headers";
import { createTRPCClient } from "@trpc/client";

import type { AppRouter } from "@restauwants/api";

import { endingLink  } from "./shared";

import superjson from "superjson";

export const api = createTRPCClient<AppRouter>({
  transformer: superjson,
  links: [
    endingLink({
      headers: () => {
        const h = new Map(headers());
        h.set("x-trpc-source", "src");
        return Object.fromEntries(h.entries());
      },
    }),
  ],
});

export { type RouterInputs, type RouterOutputs } from "@restauwants/api";