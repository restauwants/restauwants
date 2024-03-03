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

interface FriendRequestCardProps {
  name: string;
  accept: () => void;
  reject: () => void;
}

function FriendRequestCard({ name, accept, reject }: FriendRequestCardProps) {
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

function FriendRequestList() {
  return (
    <div className="flex flex-col gap-4 divide-y-2 [&>*:first-child]:pt-0 [&>div]:items-center [&>div]:pt-4 [&>p]:h-fit">
      <FriendRequestCard
        name="John Doe"
        accept={() => undefined}
        reject={() => undefined}
      />
    </div>
  );
}

interface ExistingFriendCardProps {
  name: string;
  remove: () => void;
}

function ExistingFriendCard({ name, remove }: ExistingFriendCardProps) {
  return (
    <div className="flex flex-row justify-between">
      <p>{name}</p>
      <div className="space-x-1">
        <Button variant="outline" size="sm" onClick={remove}>
          Remove
        </Button>
      </div>
    </div>
  );
}

function ExistingFriendList() {
  return (
    <div className="flex flex-col gap-4 divide-y-2 [&>*:first-child]:pt-0 [&>div]:items-center [&>div]:pt-4 [&>p]:h-fit">
      <ExistingFriendCard name="John Doe" remove={() => undefined} />
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
          <FriendRequestList />
        </ScrollArea>
        <h4 className="pt-4 font-medium">Your Friends</h4>
        <ScrollArea
          type="always"
          className="max-h-52 rounded-xl border-2 bg-card p-4"
        >
          <ExistingFriendList />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
