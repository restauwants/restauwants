"use client";

import { DropdownMenuItem } from "@restauwants/ui/dropdown-menu";

import { logout } from "../../actions";

export function Logout() {
  return <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>;
}
