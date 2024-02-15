import { NextRequest, NextResponse } from "next/server";

import { auth } from "@restauwants/auth";

const baseURL = process.env.AUTH_URL;

//import middleware from "next-auth/middleware";
export const config = {
  matcher: ["/review", "/feed", "/profile"],
};

export async function middleware(request: NextRequest) {
  const session = await auth();
  
  if (!session) {
    return NextResponse.redirect(new URL(baseURL + "/login"));
  } else if (session && request.nextUrl.pathname.startsWith("/login")) {
    // Return an empty object if the user is authenticated
    return NextResponse.redirect(new URL(baseURL + "/profile"));
  }
}
