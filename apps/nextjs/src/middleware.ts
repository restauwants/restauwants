import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { newHeadersWithPathname } from "./actions/navigation";

export const middleware = async (request: NextRequest) => {
  return NextResponse.next({
    request: {
      headers: newHeadersWithPathname(
        request.headers,
        request.nextUrl.pathname,
      ),
    },
  });
};
