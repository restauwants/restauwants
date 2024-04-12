"use client";

import { useState } from "react";

import { Button } from "@restauwants/ui/button";
import { ConfirmationDialog } from "@restauwants/ui/confirmation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@restauwants/ui/dropdown-menu";
import { SettingsIcon } from "@restauwants/ui/icons";

import { signOut } from "~/actions/auth";
import { useDialogOrDrawer } from "~/hooks/dialogOrDrawer";
import { ManageFriends } from "../../../components/friends";

export function Settings() {
  const dialogOrDrawer = useDialogOrDrawer();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  return (
    <>
      <dialogOrDrawer.Root>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <SettingsIcon className="size-8 text-primary-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <dialogOrDrawer.Trigger className="w-full">
              <DropdownMenuItem>Friends</DropdownMenuItem>
            </dialogOrDrawer.Trigger>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsSignOutModalOpen(true)}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ManageFriends
          Content={dialogOrDrawer.Content}
          Header={dialogOrDrawer.Header}
          Title={dialogOrDrawer.Title}
          Footer={dialogOrDrawer.Footer}
        />
      </dialogOrDrawer.Root>
      <ConfirmationDialog
        title="Sign-Out Confirmation"
        description="Are you sure you want to sign out?"
        cancelVerb="Cancel"
        actionVerb="Sign Out"
        onAction={() => signOut()}
        open={isSignOutModalOpen}
        onOpenChange={setIsSignOutModalOpen}
      />
    </>
  );
}
