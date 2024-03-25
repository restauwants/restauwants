"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@restauwants/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "@restauwants/ui/drawer";

import { useIsDesktop } from "./media";

interface DialogOrDrawerComponents {
  Root: typeof Dialog | typeof Drawer;
  // eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents
  Portal: typeof DialogPortal | typeof DrawerPortal;
  Overlay: typeof DialogOverlay | typeof DrawerOverlay;
  // eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents
  Trigger: typeof DialogTrigger | typeof DrawerTrigger;
  // eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents
  Close: typeof DialogClose | typeof DrawerClose;
  Content: typeof DialogContent | typeof DrawerContent;
  Header: typeof DialogHeader | typeof DrawerHeader;
  Footer: typeof DialogFooter | typeof DrawerFooter;
  // eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents
  Title: typeof DialogTitle | typeof DrawerTitle;
  // eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents
  Description: typeof DialogDescription | typeof DrawerDescription;
}

function dialogOrDrawer(isDesktop: boolean): DialogOrDrawerComponents {
  if (isDesktop) {
    return {
      Root: Dialog,
      Portal: DialogPortal,
      Overlay: DialogOverlay,
      Trigger: DialogTrigger,
      Close: DialogClose,
      Content: DialogContent,
      Header: DialogHeader,
      Footer: DialogFooter,
      Title: DialogTitle,
      Description: DialogDescription,
    };
  }
  return {
    Root: Drawer,
    Portal: DrawerPortal,
    Overlay: DrawerOverlay,
    Trigger: DrawerTrigger,
    Close: DrawerClose,
    Content: DrawerContent,
    Header: DrawerHeader,
    Footer: DrawerFooter,
    Title: DrawerTitle,
    Description: DrawerDescription,
  };
}

export const useDialogOrDrawer = () => {
  const isDesktop = useIsDesktop();
  return dialogOrDrawer(isDesktop);
};
