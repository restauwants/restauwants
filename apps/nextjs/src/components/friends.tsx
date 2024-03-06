"use client";

import type { z } from "zod";

import { Button } from "@restauwants/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
} from "@restauwants/ui/form";
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
import { toast } from "@restauwants/ui/toast";
import {
  AddFriendFormSchema,
  SentFriendRequestSchema,
} from "@restauwants/validators/client";

import { api } from "~/trpc/react";

interface FriendRequestCardProps {
  username: string;
  accept: () => void;
  reject: () => void;
}

function FriendRequestCard({
  username,
  accept,
  reject,
}: FriendRequestCardProps) {
  return (
    <div className="flex flex-row justify-between">
      <p>{username}</p>
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
  const [friendRequests] = api.friend.requests.useSuspenseQuery();

  const utils = api.useUtils();

  const acceptFriendRequest = api.friend.accept.useMutation({
    onSuccess: async (_data, variables) => {
      await utils.friend.invalidate();
      toast.success(`Accepted friend request from ${variables.fromUsername}`);
    },
    onError: (_data, variables) => {
      toast.error(
        `Failed to accept friend request from ${variables.fromUsername}`,
      );
    },
  });
  const rejectFriendRequest = api.friend.reject.useMutation({
    onSuccess: async (_data, variables) => {
      await utils.friend.invalidate();
      toast.success(`Rejected friend request from ${variables.fromUsername}`);
    },
    onError: (_data, variables) => {
      toast.error(
        `Failed to reject friend request from ${variables.fromUsername}`,
      );
    },
  });

  if (friendRequests.length === 0) {
    return <p className="text-muted-foreground">No friend requests yet!</p>;
  }

  return (
    <div className="flex flex-col gap-4 divide-y-2 [&>*:first-child]:pt-0 [&>div]:items-center [&>div]:pt-4 [&>p]:h-fit">
      {friendRequests.map((friendRequest) => (
        <FriendRequestCard
          key={friendRequest.fromUsername}
          username={friendRequest.fromUsername}
          accept={() =>
            acceptFriendRequest.mutate({
              fromUsername: friendRequest.fromUsername,
            })
          }
          reject={() =>
            rejectFriendRequest.mutate({
              fromUsername: friendRequest.fromUsername,
            })
          }
        />
      ))}
    </div>
  );
}

interface ExistingFriendCardProps {
  username: string;
  remove: () => void;
}

function ExistingFriendCard({ username, remove }: ExistingFriendCardProps) {
  return (
    <div className="flex flex-row justify-between">
      <p>{username}</p>
      <div className="space-x-1">
        <Button variant="outline" size="sm" onClick={remove}>
          Remove
        </Button>
      </div>
    </div>
  );
}

function ExistingFriendList() {
  const [friends] = api.friend.all.useSuspenseQuery();

  const utils = api.useUtils();

  const removeFriend = api.friend.remove.useMutation({
    onSuccess: async (_data, variables) => {
      await utils.friend.invalidate();
      toast.success(`Removed friend ${variables.username}`);
    },
    onError: (_data, variables) => {
      toast.error(`Failed to remove friend ${variables.username}`);
    },
  });

  if (friends.length === 0) {
    return <p className="text-muted-foreground">No friends yet!</p>;
  }

  return (
    <div className="flex flex-col gap-4 divide-y-2 [&>*:first-child]:pt-0 [&>div]:items-center [&>div]:pt-4 [&>p]:h-fit">
      {friends.map((friend) => (
        <ExistingFriendCard
          key={friend.username}
          username={friend.username}
          remove={() => removeFriend.mutate({ username: friend.username })}
        />
      ))}
    </div>
  );
}

function AddFriendForm() {
  const form = useForm({
    schema: AddFriendFormSchema,
    defaultValues: {
      username: "",
    },
  });

  const utils = api.useUtils();

  const sendFriendRequest = api.friend.add.useMutation({
    onSuccess: async () => {
      form.reset();
      await utils.friend.invalidate();
      toast.success("Friend request sent");
    },
    onError: () => {
      toast.error("Failed to send friend request");
    },
  });

  const onSubmit = (data: z.infer<typeof AddFriendFormSchema>) => {
    sendFriendRequest.mutate(SentFriendRequestSchema.parse(data));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h4 className="font-medium">Add a Friend</h4>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="pt-4">
              <FormControl>
                <Input
                  placeholder="Enter the username of your friend"
                  {...field}
                />
              </FormControl>
              <FormMessage>&nbsp;</FormMessage>
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit">Send Request</Button>
        </DialogFooter>
      </form>
    </Form>
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
        <AddFriendForm />
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
