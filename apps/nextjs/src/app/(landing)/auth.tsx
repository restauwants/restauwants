"use client";

import type { z } from "zod";
import { createContext, use, useContext, useState } from "react";

import type { UserSchemaWithOptionals } from "@restauwants/schema/client";
import { Button } from "@restauwants/ui/button";
import { DiscordIcon, GoogleIcon } from "@restauwants/ui/icons";

import { signInWithDiscord, signInWithGoogle } from "~/actions/auth";
import { useDialogOrDrawer } from "~/hooks/dialog-or-drawer";
import { api } from "~/trpc/react";

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
  const initialUser = use(props.user);
  const dialogOrDrawer = useDialogOrDrawer();
  const authProgress = useContext(AuthProgressContext);
  const { data: user } = api.user.currentWithOptionals.useQuery(undefined, {
    initialData: initialUser,
  });
  return (
    <dialogOrDrawer.Root
      open={authProgress.isInProgress}
      onOpenChange={authProgress.setIsInProgress}
    >
      <dialogOrDrawer.Content className="md:max-w-[25rem]">
        {user ? (
          <p />
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
