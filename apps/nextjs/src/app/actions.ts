"use server";

import { redirect } from "next/navigation";

import {
  signOut as _signOut,
  signIn as signInWithProvider,
} from "@restauwants/auth";

export const signInDiscord = () => signInWithProvider("discord");
export const signInGoogle = () => signInWithProvider("google");
export const signOut = () => _signOut();

export async function navigate(page: string) {
  redirect(page);
}
