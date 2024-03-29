import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth } from "@restauwants/auth";
import { isCompleteUser } from "@restauwants/validators/server/internal";

import { api } from "~/trpc/server";
import {
  profileCreationPage as profileCreationPagePath,
  profilePage as profilePagePath,
  signInPage as signInPagePath,
} from "./app/paths";

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};

const isOnPage = (request: NextRequest, page: string) => {
  return request.nextUrl.pathname === page;
};

const restrictToPage = (request: NextRequest, page: string) => {
  if (!isOnPage(request, page)) {
    return NextResponse.redirect(buildRedirectUrl(request, page));
  }
};

const buildRedirectUrl = (request: NextRequest, page: string) => {
  const baseUrl = request.nextUrl.origin;
  return `${baseUrl}${page}`;
};

function handleMissingSession(request: NextRequest) {
  return restrictToPage(request, signInPagePath);
}

async function handleExistingSession(request: NextRequest) {
  const user = await api.user.currentWithOptionals();
  if (!isCompleteUser(user)) {
    return restrictToPage(request, profileCreationPagePath);
  }
  if (
    isOnPage(request, signInPagePath) ||
    isOnPage(request, profileCreationPagePath)
  ) {
    return NextResponse.redirect(buildRedirectUrl(request, profilePagePath));
  }
}

export async function middleware(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return handleMissingSession(request);
  } else {
    return handleExistingSession(request);
  }
}
