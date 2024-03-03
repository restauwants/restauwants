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
import { CreateProfileFormSchema } from "@restauwants/validators/client";

import { logout } from "../../../actions";

export default function CreateProfile() {
  const form = useForm({
    schema: CreateProfileFormSchema,
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = (data: z.infer<typeof CreateProfileFormSchema>) => {
    console.log("Creating profile", data); // TODO
  };

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
          <Button formAction={logout}>Cancel</Button>
        </form>
        <Button type="submit" form="create-profile">
          Create Profile
        </Button>
      </div>
    </>
  );
}
