"use client";

import { AlertDialogAction } from "@restauwants/ui/alert-dialog";

import { signOut } from "../../actions";

export function SignOut() {
  return (
    <AlertDialogAction onClick={() => signOut()}>Sign Out</AlertDialogAction>
  );
}
