"use client";

import { Button } from "@restauwants/ui/button";
import { Input } from "@restauwants/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@restauwants/ui/modal";
import { ScrollArea } from "@restauwants/ui/scroll-area";

interface FriendRequestProps {
  name: string;
  accept: () => void;
  reject: () => void;
}

export function FriendRequest({ name, accept, reject }: FriendRequestProps) {
  return (
    <div className="flex flex-row justify-between">
      <p>{name}</p>
      <div className="space-x-1">
        <Button variant="outline" size="sm" onClick={accept}>
          Accept
        </Button>
        <Button variant="outline" size="sm" onClick={reject}>
          Reject
        </Button>
      </div>
    </div>
  );
}

export function ManageFriends() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary" size="sm">
          Manage Friends
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-dvh overflow-auto">
        <DialogHeader>
          <DialogTitle>Manage Friends</DialogTitle>
        </DialogHeader>
        <h4 className="font-medium">Add a Friend</h4>
        <Input id="username" placeholder="Enter the username of your friend" />
        <DialogFooter>
          <Button type="submit">Send Request</Button>
        </DialogFooter>
        <h4 className="pt-4 font-medium">Received Friend Requests</h4>
        <ScrollArea
          type="always"
          className="max-h-52 rounded-xl border-2 bg-card p-4"
        >
          <div className="flex flex-col gap-4 divide-y-2 [&>*:first-child]:pt-0 [&>div]:items-center [&>div]:pt-4 [&>p]:h-fit">
            <FriendRequest
              name="John Doe"
              accept={() => undefined}
              reject={() => undefined}
            />
          </div>
        </ScrollArea>
        <h4 className="pt-4 font-medium">Your Friends</h4>
        <ScrollArea
          type="always"
          className="max-h-52 rounded-xl border-2 bg-card p-4"
        >
          <div className="flex flex-col gap-4 divide-y-2 [&>*:first-child]:pt-0 [&>div]:items-center [&>div]:pt-4 [&>p]:h-fit">
            <div className="flex flex-row justify-between">
              <p>John Doe</p>
              <div className="space-x-1">
                <Button variant="outline" size="sm">
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
