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
import { ReviewList } from "../../../components/reviews";
import { Logout } from "./logout";

function More() {
  return (
    <Dialog>
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
          <Logout />
        </DropdownMenuContent>
      </DropdownMenu>
      <ManageFriends />
    </Dialog>
  );
}

export default async function Profile() {
  const username = (await api.user.current()).username;
  const reviews = api.review.all();

  return (
    <div className="flex min-h-dvh w-full flex-col items-center space-y-4 divide-y-2 pb-20 pt-12">
      <div className="container flex flex-row items-start justify-between gap-5 pt-4">
        <p className="min-w-0 break-words text-2xl font-bold text-primary">
          {username}
        </p>
        <More />
      </div>
      <div className="container pt-4">
        <Suspense fallback={<h4>Loading...</h4>}>
          <ReviewList reviews={reviews} />
        </Suspense>
      </div>
    </div>
  );
}
