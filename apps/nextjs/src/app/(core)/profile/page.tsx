import { Suspense } from "react";

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
import { MyReviewList } from "../../../components/reviews";
import { Logout } from "./logout";
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
            <AlertDialogTitle>Sign Out Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you absolutely sure you want to sign out?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Logout />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ManageFriends />
    </Dialog>
  );
}

export default async function Profile() {
  const user = await api.user.current();
  const reviews = api.review.all();

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
        <MyReviewList reviews={reviews} MyUserID={user.id} />
        </Suspense>
      </div>
    </div>
  );
}
