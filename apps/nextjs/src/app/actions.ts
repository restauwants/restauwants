"use server";

import { signIn, signOut } from "@restauwants/auth";

export const login = () => signIn("discord");
export const logout = () => signOut();
