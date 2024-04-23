"use server";

import {
  signOut as __signOut,
  signIn as signInWithProvider,
} from "@restauwants/auth";

export const signInWithDiscord = () => signInWithProvider("discord");
export const signInWithGoogle = () => signInWithProvider("google");
export const signOut = () => __signOut();
