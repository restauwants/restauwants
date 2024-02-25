"use client";

import { AlertDialogAction } from "@restauwants/ui/alert-dialog";

import { logout } from "../../actions";

export function Logout() {
  return <AlertDialogAction onClick={() => logout()}>Logout</AlertDialogAction>;
}
