"use client";

import type { z } from "zod";
import { useState } from "react";

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
import { toast } from "@restauwants/ui/toast";
import {
  CreateProfileFormSchema,
  CreateProfileSchema,
} from "@restauwants/validators/client";

import { navigate } from "~/app/actions";
import { profilePage as profilePagePage } from "~/app/paths";
import { api } from "~/trpc/react";
import { signOut } from "../../../actions";

export default function CreateProfile() {
  const form = useForm({
    schema: CreateProfileFormSchema,
    defaultValues: {
      username: "",
    },
  });

  const utils = api.useUtils();

  const [isLoading, setIsLoading] = useState(false);

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

  const onSubmit = (data: z.infer<typeof CreateProfileFormSchema>) => {
    setIsLoading(true);
    createProfile.mutate(CreateProfileSchema.parse(data));
  };

  if (isLoading) {
    return <h4>Creating profile...</h4>;
  }

  return (
    <>
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
                <FormMessage className="text-start">&nbsp;</FormMessage>
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
    </>
  );
}
