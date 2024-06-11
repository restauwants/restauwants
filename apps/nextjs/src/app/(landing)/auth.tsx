"use client";

import type { z } from "zod";
import { createContext, use, useContext, useState } from "react";

import type { UserSchemaWithOptionals } from "@restauwants/schema/client";

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
  console.log(user); // TODO(99)
  return (
    <dialogOrDrawer.Root
      open={authProgress.isInProgress}
      onOpenChange={authProgress.setIsInProgress}
    >
      <dialogOrDrawer.Content>
        <p>TODO(99)</p>
      </dialogOrDrawer.Content>
    </dialogOrDrawer.Root>
  );
};
