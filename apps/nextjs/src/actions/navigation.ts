"use server";

import type { z } from "zod";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { Session } from "@restauwants/auth";
import type { UserSchemaWithOptionals } from "@restauwants/schema/server/internal";
import { auth } from "@restauwants/auth";
import { isCompleteUser } from "@restauwants/schema/server/internal";

import { getPathnameFromHeaders } from "~/functions/navigation";
import { api } from "~/trpc/server";
import {
  landingPage,
  profileCreationPage,
  profilePage,
  signInPage,
} from "../app/paths";

export async function navigate(page: string) {
  redirect(page);
}

const isAtPath = (currentPath: string, targetPath: string) => {
  return currentPath === targetPath;
};

const restrictTo = async (
  currentPath: string,
  permittedPaths: string[],
  onRedirect: () => Promise<void>,
) => {
  if (!permittedPaths.some((p) => isAtPath(currentPath, p))) {
    await onRedirect();
  }
};

const handleMissingSession = async (
  currentPath: string,
  onRedirect: (path: string) => Promise<void>,
) => {
  await restrictTo(currentPath, [landingPage, signInPage], () =>
    onRedirect(landingPage),
  );
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
    await restrictTo(currentPath, [landingPage, profileCreationPage], () =>
      onRedirect(landingPage),
    );
  } else if (
    isAtPath(currentPath, profileCreationPage) ||
    isAtPath(currentPath, signInPage)
  ) {
    await onRedirect(profilePage);
  }
};

const restrictPagesBasedOnSession = async (
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

type PropsWithRoute<P = unknown> = P & {
  route: string;
};

const withRoute = <T>(
  page: (
    props: PropsWithRoute<T>,
  ) => Promise<JSX.Element | void> | JSX.Element | void,
) => {
  return async (props: T) => {
    return await page({ ...props, route: getPathnameFromHeaders(headers())! });
  };
};

export const withRestrictionsBasedOnSession = <T>(
  page: (
    props: Omit<T, "route">,
  ) => Promise<JSX.Element | void> | JSX.Element | void,
) => {
  return withRoute(async ({ route, ...props }: PropsWithRoute<T>) => {
    await restrictPagesBasedOnSession(
      auth(),
      route,
      redirect,
      api.user.currentWithOptionals,
    );
    return await page({ ...props });
  });
};
