import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth } from "@restauwants/auth";

const baseURL = process.env.AUTH_URL;

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};

export async function middleware(request: NextRequest) {
  const session = await auth();

  if (!session && !request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL(baseURL + "/login"));
  } else if (session && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL(baseURL + "/profile"));
  }
}
