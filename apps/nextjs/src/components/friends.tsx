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
import { Table, TableBody, TableCell, TableRow } from "@restauwants/ui/table";
import { toast } from "@restauwants/ui/toast";
import {
  AddFriendFormSchema,
  RevokeFriendRequestSchema,
  SentFriendRequestSchema,
} from "@restauwants/validators/client";

import { api } from "~/trpc/react";

interface FriendTableRowProps {
  children: React.ReactNode;
}

const FriendTableRow = ({ children }: FriendTableRowProps) => {
  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-row items-center justify-between">
          {children}
        </div>
      </TableCell>
    </TableRow>
  );
};

interface PlaceholderFriendTableRowProps {
  message: string;
}

const PlaceholderFriendTableRow = ({
  message,
}: PlaceholderFriendTableRowProps) => {
  return (
    <TableRow>
      <TableCell>
        <div className="flex h-8 flex-row items-center text-muted-foreground">
          {message}
        </div>
      </TableCell>
    </TableRow>
  );
};

const withFriendTable = (FriendTableRows: React.FC) => {
  const FriendTable: React.FC = () => {
    return (
      <Table>
        <TableBody>
          <FriendTableRows />
        </TableBody>
      </Table>
    );
  };
  return FriendTable;
};

interface ReceivedFriendRequestTableRowProps {
  username: string;
  accept: () => void;
  reject: () => void;
}

function ReceivedFriendRequestTableRow({
  username,
  accept,
  reject,
}: ReceivedFriendRequestTableRowProps) {
  return (
    <FriendTableRow>
      {username}
      <div className="space-x-1">
        <Button variant="outline" size="sm" onClick={accept}>
          Accept
        </Button>
        <Button variant="outline" size="sm" onClick={reject}>
          Reject
        </Button>
      </div>
    </FriendTableRow>
  );
}

const ReceivedFriendRequestsTable = withFriendTable(() => {
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
    return <PlaceholderFriendTableRow message="None yet! Check back later." />;
  }

  return receivedFriendRequests.map((receivedfriendRequest) => (
    <ReceivedFriendRequestTableRow
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

interface ExistingFriendTableRowProps {
  username: string;
  remove: () => void;
}

function ExistingFriendTableRow({
  username,
  remove,
}: ExistingFriendTableRowProps) {
  return (
    <FriendTableRow>
      {username}
      <Button variant="outline" size="sm" onClick={remove}>
        Remove
      </Button>
    </FriendTableRow>
  );
}

const ExistingFriendsTable = withFriendTable(() => {
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
    return <PlaceholderFriendTableRow message="It's just you here for now!" />;
  }

  return friends.map((friend) => (
    <ExistingFriendTableRow
      key={friend.username}
      username={friend.username}
      remove={() => removeFriend.mutate({ username: friend.username })}
    />
  ));
});

interface SentFriendRequestTableRowProps {
  username: string;
  revoke: () => void;
}

function SentFriendRequestTableRow({
  username,
  revoke,
}: SentFriendRequestTableRowProps) {
  return (
    <FriendTableRow>
      {username}
      <Button variant="outline" size="sm" onClick={revoke}>
        Cancel
      </Button>
    </FriendTableRow>
  );
}

const SentFriendRequestsTable = withFriendTable(() => {
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
    return <PlaceholderFriendTableRow message="Try adding a friend!" />;
  }

  return sentFriendRequests.map((sentFriendRequest) => (
    <SentFriendRequestTableRow
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

function AddFriendForm(props: {
  Footer: React.ComponentType<{ children: React.ReactNode }>;
}) {
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
        <props.Footer>
          <Button type="submit">Send Request</Button>
        </props.Footer>
      </form>
    </Form>
  );
}

export function ManageFriends(props: {
  Content: React.ComponentType<{ children: React.ReactNode }>;
  Header: React.ComponentType<{ children: React.ReactNode }>;
  Title: React.ComponentType<{ children: React.ReactNode }>;
  Footer: React.ComponentType<{ children: React.ReactNode }>;
}) {
  return (
    <props.Content>
      <props.Header>
        <props.Title>Manage Friends</props.Title>
      </props.Header>
      <h4 className="font-medium">Add a Friend</h4>
      <AddFriendForm Footer={props.Footer} />
      <h4 className="pt-4 font-medium">Sent Friend Requests</h4>
      <SentFriendRequestsTable />
      <h4 className="pt-4 font-medium">Received Friend Requests</h4>
      <ReceivedFriendRequestsTable />
      <h4 className="pt-4 font-medium">Your Friends</h4>
      <ExistingFriendsTable />
    </props.Content>
  );
}
