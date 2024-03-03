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
import { AddFriendFormSchema } from "@restauwants/validators/client";

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

function AddFriendForm() {
  const form = useForm({
    schema: AddFriendFormSchema,
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = (data: z.infer<typeof AddFriendFormSchema>) => {
    console.log(data);
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
