"use client";

import { createContext, useContext, useState } from "react";

import { useDialogOrDrawer } from "~/hooks/dialog-or-drawer";

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

export const Auth = () => {
  const dialogOrDrawer = useDialogOrDrawer();
  const authProgress = useContext(AuthProgressContext);
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
