import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth } from "@restauwants/auth";

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};

export async function middleware(request: NextRequest) {
  const session = await auth();
  const baseUrl = request.nextUrl.origin;

  if (!session && !request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(`${baseUrl}/login`);
  } else if (session && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(`${baseUrl}/profile`);
  }
}
