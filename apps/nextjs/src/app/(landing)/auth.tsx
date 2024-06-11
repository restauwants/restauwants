"use client";

import type { z } from "zod";
import { createContext, use, useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { UserSchemaWithOptionals } from "@restauwants/schema/client";
import {
  CreateProfileFormSchema,
  CreateProfileSchema,
  isCompleteUser,
} from "@restauwants/schema/client";
import { Button } from "@restauwants/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@restauwants/ui/form";
import { DiscordIcon, GoogleIcon } from "@restauwants/ui/icons";
import { Input } from "@restauwants/ui/input";
import { toast } from "@restauwants/ui/toast";

import { signInWithDiscord, signInWithGoogle, signOut } from "~/actions/auth";
import { useDialogOrDrawer } from "~/hooks/dialog-or-drawer";
import { api } from "~/trpc/react";
import { profilePage } from "../paths";

interface AuthProgressContextType {
  isInProgress: boolean;
  setIsInProgress?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthProgressContext = createContext<AuthProgressContextType>({
  isInProgress: false,
});

export const AuthProgressContextProvider = ({
  children,
}: React.PropsWithChildren) => {
  const [isInProgress, setIsInProgress] = useState(false);

  const ctx = {
    isInProgress: isInProgress,
    setIsInProgress: setIsInProgress,
  };

  return (
    <AuthProgressContext.Provider value={ctx}>
      {children}
    </AuthProgressContext.Provider>
  );
};

interface AuthProps {
  user: Promise<z.infer<typeof UserSchemaWithOptionals> | undefined>;
}

export const Auth = (props: AuthProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dialogOrDrawer = useDialogOrDrawer();
  const authProgress = useContext(AuthProgressContext);
  const initialUser = use(props.user);
  const { data: user } = api.user.currentWithOptionals.useQuery(undefined, {
    initialData: initialUser,
  });

  useEffect(() => {
    if (searchParams.get("callback") && user) {
      // user just signed in
      authProgress.setIsInProgress?.(true);
    }
  }, [searchParams, authProgress]);

  const utils = api.useUtils();
  const form = useForm({
    schema: CreateProfileFormSchema,
    defaultValues: {
      username: "",
    },
  });
  const createProfile = api.user.profile.create.useMutation({
    onSuccess: async () => {
      await utils.user.invalidate();
      router.push(profilePage);
    },
    onError: () => {
      toast.error("Failed to create profile");
    },
  });
  const onCreateProfileFormSubmit = (
    formInput: z.input<typeof CreateProfileFormSchema>,
  ) => {
    const formOutput = CreateProfileFormSchema.parse(formInput);
    createProfile.mutate(CreateProfileSchema.parse(formOutput));
  };

  if (authProgress.isInProgress && user && isCompleteUser(user)) {
    router.push(profilePage);
  }

  return (
    <dialogOrDrawer.Root
      open={authProgress.isInProgress}
      onOpenChange={authProgress.setIsInProgress}
    >
      <dialogOrDrawer.Content className="md:max-w-[25rem]">
        {user ? (
          <>
            <dialogOrDrawer.Header>
              <dialogOrDrawer.Title className="text-center">
                Create Profile
              </dialogOrDrawer.Title>
            </dialogOrDrawer.Header>
            <div className="flex flex-col gap-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onCreateProfileFormSubmit)}
                  id="create-profile"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage reserve />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
              <div className="flex flex-row justify-end gap-2">
                <form>
                  <Button formAction={signOut} variant="outline">
                    Cancel
                  </Button>
                </form>
                <Button type="submit" form="create-profile">
                  Create
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <dialogOrDrawer.Header>
              <dialogOrDrawer.Title className="text-center">
                Sign In
              </dialogOrDrawer.Title>
            </dialogOrDrawer.Header>
            <div className="flex flex-col items-center gap-2">
              <form>
                <Button
                  size="lg"
                  formAction={signInWithDiscord}
                  variant="outline"
                  className="flex w-56 flex-row gap-5 md:w-80"
                >
                  <DiscordIcon />
                  <span>Discord</span>
                </Button>
              </form>
              <form>
                <Button
                  size="lg"
                  formAction={signInWithGoogle}
                  variant="outline"
                  className="flex w-56 flex-row gap-5 md:w-80"
                >
                  <GoogleIcon />
                  <span>Google</span>
                </Button>
              </form>
            </div>
          </>
        )}
      </dialogOrDrawer.Content>
    </dialogOrDrawer.Root>
  );
};
