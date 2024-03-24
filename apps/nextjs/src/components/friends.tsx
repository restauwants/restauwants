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
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@restauwants/ui/modal";
import { toast } from "@restauwants/ui/toast";
import {
  AddFriendFormSchema,
  RevokeFriendRequestSchema,
  SentFriendRequestSchema,
} from "@restauwants/validators/client";

import { api } from "~/trpc/react";

interface CardProps {
  children: React.ReactNode;
}

const Card = ({ children }: CardProps) => {
  return (
    <div className="flex h-16 flex-row items-center justify-between p-4">
      {children}
    </div>
  );
};

interface PlaceholderCardProps {
  message: string;
}

const PlaceholderCard = ({ message }: PlaceholderCardProps) => {
  return (
    <Card>
      <p className="text-muted-foreground">{message}</p>
    </Card>
  );
};

const withCardListContainer = (CardList: React.FC) => {
  const CardListContainer: React.FC = () => {
    return (
      <div className="flex flex-col divide-y rounded-xl border bg-card">
        <CardList />
      </div>
    );
  };
  return CardListContainer;
};

interface ReceivedFriendRequestCardProps {
  username: string;
  accept: () => void;
  reject: () => void;
}

function ReceivedFriendRequestCard({
  username,
  accept,
  reject,
}: ReceivedFriendRequestCardProps) {
  return (
    <Card>
      <p>{username}</p>
      <div className="space-x-1">
        <Button variant="outline" size="sm" onClick={accept}>
          Accept
        </Button>
        <Button variant="outline" size="sm" onClick={reject}>
          Reject
        </Button>
      </div>
    </Card>
  );
}

const ReceivedFriendRequestList = withCardListContainer(() => {
  const [receivedFriendRequests] =
    api.friend.request.received.useSuspenseQuery();

  const utils = api.useUtils();

  const acceptFriendRequest = api.friend.request.accept.useMutation({
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
  const rejectFriendRequest = api.friend.request.reject.useMutation({
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

  if (receivedFriendRequests.length === 0) {
    return <PlaceholderCard message="None yet! Check back later." />;
  }

  return receivedFriendRequests.map((receivedfriendRequest) => (
    <ReceivedFriendRequestCard
      key={receivedfriendRequest.fromUsername}
      username={receivedfriendRequest.fromUsername}
      accept={() =>
        acceptFriendRequest.mutate({
          fromUsername: receivedfriendRequest.fromUsername,
        })
      }
      reject={() =>
        rejectFriendRequest.mutate({
          fromUsername: receivedfriendRequest.fromUsername,
        })
      }
    />
  ));
});

interface ExistingFriendCardProps {
  username: string;
  remove: () => void;
}

function ExistingFriendCard({ username, remove }: ExistingFriendCardProps) {
  return (
    <Card>
      <p>{username}</p>
      <Button variant="outline" size="sm" onClick={remove}>
        Remove
      </Button>
    </Card>
  );
}

const ExistingFriendList = withCardListContainer(() => {
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
    return <PlaceholderCard message="It's just you here for now!" />;
  }

  return friends.map((friend) => (
    <ExistingFriendCard
      key={friend.username}
      username={friend.username}
      remove={() => removeFriend.mutate({ username: friend.username })}
    />
  ));
});

interface SentFriendRequestCardProps {
  username: string;
  revoke: () => void;
}

function SentFriendRequestCard({
  username,
  revoke,
}: SentFriendRequestCardProps) {
  return (
    <Card>
      <p>{username}</p>
      <Button variant="outline" size="sm" onClick={revoke}>
        Cancel
      </Button>
    </Card>
  );
}

const SentFriendRequestList = withCardListContainer(() => {
  const [sentFriendRequests] = api.friend.request.sent.useSuspenseQuery();

  const utils = api.useUtils();

  const revokeFriendRequest = api.friend.request.revoke.useMutation({
    onSuccess: async (_data, variables) => {
      await utils.friend.invalidate();
      toast.success(`Cancelled friend request to ${variables.toUsername}`);
    },
    onError: (_data, variables) => {
      toast.error(`Failed to cancel friend request to ${variables.toUsername}`);
    },
  });

  if (sentFriendRequests.length === 0) {
    return <PlaceholderCard message="Try adding a friend!" />;
  }

  return sentFriendRequests.map((sentFriendRequest) => (
    <SentFriendRequestCard
      key={sentFriendRequest.toUsername}
      username={sentFriendRequest.toUsername}
      revoke={() =>
        revokeFriendRequest.mutate(
          RevokeFriendRequestSchema.parse({
            toUsername: sentFriendRequest.toUsername,
          }),
        )
      }
    />
  ));
});

function AddFriendForm() {
  const form = useForm({
    schema: AddFriendFormSchema,
    defaultValues: {
      username: "",
    },
  });

  const utils = api.useUtils();

  const sendFriendRequest = api.friend.request.send.useMutation({
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
    sendFriendRequest.mutate(
      SentFriendRequestSchema.parse({
        toUsername: data.username,
      }),
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
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
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Manage Friends</DialogTitle>
      </DialogHeader>
      <h4 className="font-medium">Add a Friend</h4>
      <AddFriendForm />
      <h4 className="pt-4 font-medium">Sent Friend Requests</h4>
      <SentFriendRequestList />
      <h4 className="pt-4 font-medium">Received Friend Requests</h4>
      <ReceivedFriendRequestList />
      <h4 className="pt-4 font-medium">Your Friends</h4>
      <ExistingFriendList />
    </DialogContent>
  );
}
