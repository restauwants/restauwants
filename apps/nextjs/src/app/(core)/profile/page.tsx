import { Suspense } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "node_modules/@restauwants/ui/src/alert-dialog";

import { Button } from "@restauwants/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@restauwants/ui/dropdown-menu";
import { DotsVerticalIcon } from "@restauwants/ui/icons";
import { Dialog, DialogTrigger } from "@restauwants/ui/modal";

import { api } from "~/trpc/server";
import { ManageFriends } from "../../../components/friends";
import { Posts_collection } from "../../../components/posts_collection";
import { SignOut } from "./signOut";

function More() {
  return (
    <Dialog>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <DotsVerticalIcon className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DialogTrigger className="w-full">
              <DropdownMenuItem>Friends</DropdownMenuItem>
            </DialogTrigger>
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
            <SignOut />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ManageFriends />
    </Dialog>
  );
}

export default async function Profile() {
  const user = await api.user.current();
  const reviews = api.review.byUserId({ userId: user.id });
  const collections = api.collection.all();

  return (
    <div className="flex min-h-dvh w-full flex-col items-center space-y-4 divide-y-2 pb-20 pt-12">
      <div className="container flex flex-row items-start justify-between gap-5 pt-4">
        <p className="min-w-0 break-words text-2xl font-bold text-primary">
          {user.username}
        </p>
        <More />
      </div>
      <div className="container pt-4">
        <Suspense fallback={<h4>Loading...</h4>}>
          <Posts_collection
            reviews={reviews}
            curUser={user.id}
            collections={collections}
          />
        </Suspense>
      </div>
    </div>
  );
}
