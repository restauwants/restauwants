"use client";

import type { z } from "zod";
import { useState } from "react";

import {
  AddFriendFormSchema,
  RejectFriendRequestSchema,
  RemoveFriendSchema,
  RevokeFriendRequestSchema,
  SentFriendRequestSchema,
} from "@restauwants/schema/client";
import { Button } from "@restauwants/ui/button";
import { ConfirmationDialog } from "@restauwants/ui/confirmation";
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

const withFriendTable = (FriendTableRows: React.ComponentType) => {
  const FriendTable = () => {
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
  onAccept: () => void;
  onReject: () => void;
}

function ReceivedFriendRequestTableRow({
  username,
  onAccept,
  onReject,
}: ReceivedFriendRequestTableRowProps) {
  return (
    <FriendTableRow>
      {username}
      <div className="space-x-1">
        <Button variant="outline" size="sm" onClick={onAccept}>
          Accept
        </Button>
        <Button variant="outline" size="sm" onClick={onReject}>
          Reject
        </Button>
      </div>
    </FriendTableRow>
  );
}

const ReceivedFriendRequestsTable = withFriendTable(() => {
  const [receivedFriendRequests] =
    api.friend.request.received.useSuspenseQuery();
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [usernameToReject, setUsernameToReject] = useState<string>();

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

  const openRejectModalFor = (fromUsername: string) => {
    setUsernameToReject(fromUsername);
    setIsRejectModalOpen(true);
  };

  if (receivedFriendRequests.length === 0) {
    return <PlaceholderFriendTableRow message="None yet! Check back later." />;
  }

  return (
    <>
      {receivedFriendRequests.map((receivedFriendRequest) => (
        <ReceivedFriendRequestTableRow
          key={receivedFriendRequest.fromUsername}
          username={receivedFriendRequest.fromUsername}
          onAccept={() =>
            acceptFriendRequest.mutate({
              fromUsername: receivedFriendRequest.fromUsername,
            })
          }
          onReject={() =>
            openRejectModalFor(receivedFriendRequest.fromUsername)
          }
        />
      ))}
      <ConfirmationDialog
        title="Are you sure about rejecting this request?"
        description={`Your friend request from ${usernameToReject!} will be rejected.`}
        cancelVerb="Cancel"
        actionVerb="Reject"
        onAction={() =>
          rejectFriendRequest.mutate(
            RejectFriendRequestSchema.parse({
              fromUsername: usernameToReject!,
            }),
          )
        }
        open={isRejectModalOpen}
        onOpenChange={setIsRejectModalOpen}
      />
    </>
  );
});

interface ExistingFriendTableRowProps {
  username: string;
  onRemove: () => void;
}

function ExistingFriendTableRow({
  username,
  onRemove,
}: ExistingFriendTableRowProps) {
  return (
    <FriendTableRow>
      {username}
      <Button variant="outline" size="sm" onClick={onRemove}>
        Remove
      </Button>
    </FriendTableRow>
  );
}

const ExistingFriendsTable = withFriendTable(() => {
  const [friends] = api.friend.all.useSuspenseQuery();
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [usernameToRemove, setUsernameToRemove] = useState<string>();

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

  const openRemoveModalFor = (username: string) => {
    setUsernameToRemove(username);
    setIsRemoveModalOpen(true);
  };

  if (friends.length === 0) {
    return <PlaceholderFriendTableRow message="It's just you here for now!" />;
  }

  return (
    <>
      {friends.map((friend) => (
        <ExistingFriendTableRow
          key={friend.username}
          username={friend.username}
          onRemove={() => openRemoveModalFor(friend.username)}
        />
      ))}
      <ConfirmationDialog
        title="Are you sure about removing this friend?"
        description={`You will no longer be friends with ${usernameToRemove!}.`}
        cancelVerb="Cancel"
        actionVerb="Remove"
        onAction={() =>
          removeFriend.mutate(
            RemoveFriendSchema.parse({ username: usernameToRemove! }),
          )
        }
        open={isRemoveModalOpen}
        onOpenChange={setIsRemoveModalOpen}
      />
    </>
  );
});

interface SentFriendRequestTableRowProps {
  username: string;
  onRevoke: () => void;
}

function SentFriendRequestTableRow({
  username,
  onRevoke,
}: SentFriendRequestTableRowProps) {
  return (
    <FriendTableRow>
      {username}
      <Button variant="outline" size="sm" onClick={onRevoke}>
        Cancel
      </Button>
    </FriendTableRow>
  );
}

const SentFriendRequestsTable = withFriendTable(() => {
  const [sentFriendRequests] = api.friend.request.sent.useSuspenseQuery();
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [usernameToRevoke, setUsernameToRevoke] = useState<string>();

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

  const openRevokeModalFor = (toUsername: string) => {
    setUsernameToRevoke(toUsername);
    setIsRevokeModalOpen(true);
  };

  if (sentFriendRequests.length === 0) {
    return <PlaceholderFriendTableRow message="Try adding a friend!" />;
  }

  return (
    <>
      {sentFriendRequests.map((sentFriendRequest) => (
        <SentFriendRequestTableRow
          key={sentFriendRequest.toUsername}
          username={sentFriendRequest.toUsername}
          onRevoke={() => openRevokeModalFor(sentFriendRequest.toUsername)}
        />
      ))}
      <ConfirmationDialog
        title="Are you sure about canceling this request?"
        description={`Your friend request to ${usernameToRevoke!} will be canceled.`}
        cancelVerb="Don't Cancel"
        actionVerb="Cancel"
        onAction={() =>
          revokeFriendRequest.mutate(
            RevokeFriendRequestSchema.parse({
              toUsername: usernameToRevoke!,
            }),
          )
        }
        open={isRevokeModalOpen}
        onOpenChange={setIsRevokeModalOpen}
      />
    </>
  );
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
    onSuccess: async (_data, variables) => {
      form.reset();
      await utils.friend.invalidate();
      toast.success(`Friend request sent to ${variables.toUsername}`);
    },
    onError: (_data, variables) => {
      toast.error(`Failed to send friend request to ${variables.toUsername}`);
    },
  });

  const onSubmit = (formInput: z.input<typeof AddFriendFormSchema>) => {
    const formOutput = AddFriendFormSchema.parse(formInput);
    sendFriendRequest.mutate(
      SentFriendRequestSchema.parse({
        toUsername: formOutput.username,
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
              <FormMessage reserve />
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
