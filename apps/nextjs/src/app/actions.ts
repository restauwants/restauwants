"use server";

import { redirect } from "next/navigation";

import { signIn, signOut } from "@restauwants/auth";

export const login = () => signIn("discord");
export const logout = () => signOut();

export async function navigate(page: string) {
  redirect(page);
}
