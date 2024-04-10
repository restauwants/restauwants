"use server";

import type { z } from "zod";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { Session } from "@restauwants/auth";
import type { UserSchemaWithOptionals } from "@restauwants/validators/server/internal";
import { auth } from "@restauwants/auth";
import { isCompleteUser } from "@restauwants/validators/server/internal";

import { api } from "~/trpc/server";
import { profileCreationPage, profilePage, signInPage } from "../app/paths";

const pathnameHeader = "x-pathname";

export const newHeadersWithPathname = (headers: Headers, pathname: string) => {
  const newHeaders = new Headers(headers);
  newHeaders.set(pathnameHeader, pathname);
  return newHeaders;
};

export const getPathnameFromHeaders = (headers: Headers) => {
  return headers.get(pathnameHeader);
};

const isAtPath = (currentPath: string, targetPath: string) => {
  return currentPath === targetPath;
};

const restrictTo = async (
  currentPath: string,
  destinationPath: string,
  onRedirect: (path: string) => Promise<void>,
) => {
  if (!isAtPath(currentPath, destinationPath)) {
    await onRedirect(destinationPath);
  }
};

const handleMissingSession = async (
  currentPath: string,
  onRedirect: (path: string) => Promise<void>,
) => {
  await restrictTo(currentPath, signInPage, onRedirect);
};

const hasCreatedProfile = async (
  getCurrentUserWithOptionals: () => Promise<
    z.infer<typeof UserSchemaWithOptionals> | undefined
  >,
) => {
  const user = await getCurrentUserWithOptionals();
  if (!user) {
    return false;
  }
  return isCompleteUser(user);
};

const handleExistingSession = async (
  currentPath: string,
  onRedirect: (path: string) => Promise<void>,
  getCurrentUserWithOptionals: () => Promise<
    z.infer<typeof UserSchemaWithOptionals> | undefined
  >,
) => {
  if (!(await hasCreatedProfile(getCurrentUserWithOptionals))) {
    await restrictTo(currentPath, profileCreationPage, onRedirect);
  } else if (
    isAtPath(currentPath, profileCreationPage) ||
    isAtPath(currentPath, signInPage)
  ) {
    await onRedirect(profilePage);
  }
};

// TODO: remove this export
export const restrictPagesBasedOnSession = async (
  session: Promise<Session | null>,
  currentPath: string,
  onRedirect: (path: string) => Promise<void>,
  getCurrentUserWithOptionals: () => Promise<
    z.infer<typeof UserSchemaWithOptionals> | undefined
  >,
) => {
  if (!(await session)) {
    await handleMissingSession(currentPath, onRedirect);
  } else {
    await handleExistingSession(
      currentPath,
      onRedirect,
      getCurrentUserWithOptionals,
    );
  }
};

export const withRestrictionsBasedOnSession = <T>(
  page: (props: T) => Promise<JSX.Element | void> | JSX.Element | void,
) => {
  return async (props: T) => {
    await restrictPagesBasedOnSession(
      auth(),
      getPathnameFromHeaders(headers())!,
      redirect,
      api.user.currentWithOptionals,
    );
    return await page(props);
  };
};
