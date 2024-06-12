"use client";

import { useContext } from "react";

import { Button } from "@restauwants/ui/button";

import { AuthProgressContext } from "./auth";

export const Hero = () => {
  const authProgress = useContext(AuthProgressContext);
  return (
    <div className="container flex max-w-[32rem] flex-col items-center pt-24 sm:max-w-[40rem] lg:max-w-[60rem]">
      <h1 className="text-center text-3xl font-bold sm:text-5xl lg:text-6xl/tight">
        A better way to discover and share restaurants
      </h1>
      <p className="mt-5 max-w-[38rem] text-center leading-snug text-muted-foreground sm:text-lg">
        Review your dining experiences, share your findings with friends, and
        receive recommendations from the people you trust&nbsp;most.
      </p>
      <Button
        variant="primary"
        className="mt-8 h-10"
        onClick={() => authProgress.setIsInProgress?.(true)}
      >
        Start reviewing for free
      </Button>
    </div>
  );
};
