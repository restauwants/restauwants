"use server";

import { redirect } from "next/navigation";

import { signIn as signInWithProvider, signOut as _signOut } from "@restauwants/auth";

export const signIn = () => signInWithProvider("discord");
export const signOut = () => _signOut();

export async function navigate(page: string) {
  redirect(page);
}
