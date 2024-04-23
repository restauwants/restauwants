"use client";

import type { z } from "zod";
import { useEffect, useState } from "react";

import {
  CreateProfileFormSchema,
  CreateProfileSchema,
} from "@restauwants/schema/client";
import { Button } from "@restauwants/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@restauwants/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
} from "@restauwants/ui/form";
import { Input } from "@restauwants/ui/input";
import { toast } from "@restauwants/ui/toast";

import { signOut } from "~/actions/auth";
import { navigate } from "~/actions/navigation";
import { profilePage as profilePagePage } from "~/app/paths";
import { api } from "~/trpc/react";

export const CreateProfileModal = () => {
  const form = useForm({
    schema: CreateProfileFormSchema,
    defaultValues: {
      username: "",
    },
  });

  const utils = api.useUtils();

  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const onOpenChange = async (open: boolean) => {
    if (!open) {
      await signOut();
    }
    setOpen(open);
  };

  const createProfile = api.user.profile.create.useMutation({
    onSuccess: async () => {
      await utils.user.invalidate();
      await navigate(profilePagePage);
    },
    onError: () => {
      toast.error("Failed to create profile");
      setIsLoading(false);
    },
  });

  const onSubmit = (formInput: z.input<typeof CreateProfileFormSchema>) => {
    const formOutput = CreateProfileFormSchema.parse(formInput);
    setIsLoading(true);
    createProfile.mutate(CreateProfileSchema.parse(formOutput));
  };

  if (isLoading) {
    return <h4>Creating profile...</h4>;
  }

  return (
    <>
      <p>Sign up now!</p>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ textAlign: "center" }}>
              Create Profile
            </DialogTitle>
            <DialogDescription style={{ textAlign: "center" }}>
              Please select a username.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full"
              id="create-profile"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="pt-4">
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="Enter your username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage reserve />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <div className="flex w-full justify-end gap-2">
            <form>
              <Button formAction={signOut}>Cancel</Button>
            </form>
            <Button type="submit" form="create-profile">
              Create Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
