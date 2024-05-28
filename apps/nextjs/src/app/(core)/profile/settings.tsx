"use client";

import { useState } from "react";

import { Button } from "@restauwants/ui/button";
import { ConfirmationDialog } from "@restauwants/ui/confirmation";
import { FriendsIcon, SignOutIcon } from "@restauwants/ui/icons";

import { signOut } from "~/actions/auth";
import { useDialogOrDrawer } from "~/hooks/dialog-or-drawer";
import { ManageFriends } from "../../../components/friends";

export function Settings() {
  const dialogOrDrawer = useDialogOrDrawer();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  return (
    <div className="flex flex-row gap-2 md:gap-4">
      <dialogOrDrawer.Root>
        <dialogOrDrawer.Trigger asChild>
          <Button size="icon">
            <FriendsIcon />
          </Button>
        </dialogOrDrawer.Trigger>
        <ManageFriends
          Content={dialogOrDrawer.Content}
          Header={dialogOrDrawer.Header}
          Title={dialogOrDrawer.Title}
          Footer={dialogOrDrawer.Footer}
        />
      </dialogOrDrawer.Root>
      <Button onClick={() => setIsSignOutModalOpen(true)} size="icon">
        <SignOutIcon />
      </Button>
      <ConfirmationDialog
        title="Sign-Out Confirmation"
        description="Are you sure you want to sign out?"
        cancelVerb="Cancel"
        actionVerb="Sign Out"
        onAction={() => signOut()}
        open={isSignOutModalOpen}
        onOpenChange={setIsSignOutModalOpen}
      />
    </div>
  );
}
