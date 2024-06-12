"use client";

import { useContext } from "react";

import { Button } from "@restauwants/ui/button";
import { ShrimpIcon } from "@restauwants/ui/icons";

import { AuthProgressContext } from "./auth";

export const CallToAction = () => {
  const authProgress = useContext(AuthProgressContext);
  return (
    <div className="container flex flex-col items-center pt-20 md:pt-48">
      <div className="relative flex flex-col items-center rounded-2xl border-2 bg-background px-6 py-16 shadow-xl sm:px-10">
        <ShrimpIcon className="absolute -left-[95px] -top-[105px] -z-50 hidden size-52 md:block" />
        <h2 className="text-center text-3xl font-bold sm:text-4xl">
          Why not give it a&nbsp;try?
        </h2>
        <p className="mt-5 text-center leading-snug text-muted-foreground sm:text-lg">
          Create an account and start reviewing, completely&nbsp;free.
        </p>
        <Button
          variant="primary"
          className="mt-8 h-10 w-52"
          onClick={() => authProgress.setIsInProgress?.(true)}
        >
          Start reviewing
        </Button>
      </div>
    </div>
  );
};
