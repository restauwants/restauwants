"use client";

import type { z } from "zod";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "node_modules/@restauwants/ui/src/alert-dialog";

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
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

// interface OutgoingFriendRequestsCardProps {
//   username: string;
//   cancel: () => void;
// }

// function OutgoingFriendRCard({username, cancel}: OutgoingFriendRequestsCardProps){
//   return (
//     <div className="flex flex-row justify-between">
//       <p>{username}</p>
//       <div className="space-x-1">
//         <Button variant="outline" size="sm" onClick={cancel}>
//           Cancel
//         </Button>
//       </div>
//     </div>
//   )
// }
// // function OutgoingRequests(){
//   const [sentfriendrequests] = api.friend.sentRequests.useSuspenseQuery();
//   const utils = api.useUtils();
//   //Implement Cancel outgoing requests

//   const cancelRequest = api.friend.cancel.useMutation({
//     onSuccess: async (_data, variables) => {
//       await utils.friend.invalidate();
//       toast.success(`Removed Request for ${variables.username}`);
//     },
//     onError: (_data, variables) => {
//       toast.error(`Failed to cancel request for ${variables.username}`);
//     },
//   });

//   if (sentfriendrequests.length == 0){
//     return <p className="text-muted-foreground">Let's find some fellow foodies!</p>;
//   }

//   return(
//     <div className="flex flex-col gap-4 divide-y-2 [&>*:first-child]:pt-0 [&>div]:items-center [&>div]:pt-4 [&>p]:h-fit">
//       {sentfriendrequests.map((sentfriendrequests) => (
//         <OutgoingFriendRCard
//           key={sentfriendrequests.username}
//           username={sentfriendrequests.username}
//           cancel={() => cancelRequest.mutate({ username: sentfriendrequests.username })}
//         />
//       ))}
//     </div>
//   );
// }

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
  const [isSent, setisSent] = useState(false);
  const [username, setUsername] = useState("");
  const [friendRequestExists, setFriendRequestExists] = useState(false);
  const form = useForm({
    schema: AddFriendFormSchema,
    defaultValues: {
      username: "",
    },
  });

  const utils = api.useUtils();

  const handleCloseModal = () => {
    setisSent(false);
  };

  const sendFriendRequest = api.friend.add.useMutation({
    onSuccess: async () => {
      setUsername(form.getValues("username"));
      form.reset();
      await utils.friend.invalidate();
      setisSent(true);
      // toast.success("Friend request sent");
    },
    onError: () => {
      toast.error("Failed to send friend request");
    },
  });

  const doesExist = (username: string): boolean => {
    try {
      SentFriendRequestSchema.parse({ username });
      return true;
    } catch (error) {
      return false;
    }
  };

  const onSubmit = (data: z.infer<typeof AddFriendFormSchema>) => {
    const requestExists = doesExist(data.username);
    if (requestExists) {
      setUsername(form.getValues("username"));
      setFriendRequestExists(true);
    } else {
      try {
        sendFriendRequest.mutate(SentFriendRequestSchema.parse(data));
      } catch (error) {
        toast.error("failed to send friend request");
      }
    }
  };
  // sendFriendRequest.mutate(SentFriendRequestSchema.parse(data));

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
        {friendRequestExists && (
          <AlertDialog
            open={friendRequestExists}
            onOpenChange={setFriendRequestExists}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Request Already Sent</AlertDialogTitle>
                <AlertDialogDescription>
                  You already sent friend request to{" "}
                  <span className="text-[16px] font-bold text-black">
                    {username}
                  </span>
                  !
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>OK</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {isSent && (
          <AlertDialog open={isSent} onOpenChange={setisSent}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {" "}
                  Friend Request Confirmation
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Your friend request to{" "}
                  <span className="text-[16px] font-bold text-black">
                    {username}
                  </span>{" "}
                  has been successfully sent!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleCloseModal}>
                  OK
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </form>
    </Form>
  );
}

export function ManageFriends() {
  //Should have Outgoing Requests as well
  return (
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
  );
}
