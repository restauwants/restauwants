"use server";

import { redirect } from "next/navigation";

import {
  signOut as _signOut,
  signIn as signInWithProvider,
} from "@restauwants/auth";

export const signInWithDiscord = () => signInWithProvider("discord");
export const signInWithGoogle = () => signInWithProvider("google");
export const signOut = () => _signOut();

export async function navigate(page: string) {
  redirect(page);
}
