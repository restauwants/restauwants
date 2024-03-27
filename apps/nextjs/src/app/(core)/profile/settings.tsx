"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@restauwants/ui/alert-dialog";
import { Button } from "@restauwants/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@restauwants/ui/dropdown-menu";
import { SettingsIcon } from "@restauwants/ui/icons";

import { useDialogOrDrawer } from "~/hooks/dialogOrDrawer";
import { ManageFriends } from "../../../components/friends";
import { signOut } from "../../actions";

export function Settings() {
  const dialogOrDrawer = useDialogOrDrawer();
  return (
    <dialogOrDrawer.Root>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <SettingsIcon className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <dialogOrDrawer.Trigger className="w-full">
              <DropdownMenuItem>Friends</DropdownMenuItem>
            </dialogOrDrawer.Trigger>
            <DropdownMenuSeparator />
            <AlertDialogTrigger className="w-full">
              <DropdownMenuItem>Sign Out</DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign-Out Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => signOut()}>
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ManageFriends
        Content={dialogOrDrawer.Content}
        Header={dialogOrDrawer.Header}
        Title={dialogOrDrawer.Title}
        Footer={dialogOrDrawer.Footer}
      />
    </dialogOrDrawer.Root>
  );
}
