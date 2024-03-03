import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth } from "@restauwants/auth";
import { isCompleteUser } from "@restauwants/validators/server/internal";

import { api } from "~/trpc/server";
import {
  loginPage as loginPagePath,
  profileCreationPage as profileCreationPagePath,
  profilePage as profilePagePath,
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
  return restrictToPage(request, loginPagePath);
}

async function handleExistingSession(request: NextRequest) {
  const user = await api.user.current();
  if (!isCompleteUser(user)) {
    return restrictToPage(request, profileCreationPagePath);
  }
  if (
    isOnPage(request, loginPagePath) ||
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
