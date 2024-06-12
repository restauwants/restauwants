"use client";

import { useContext } from "react";
import Link from "next/link";

import { Button } from "@restauwants/ui/button";

import { landingPage } from "../paths";
import { AuthProgressContext } from "./auth";

export const Header = () => {
  const authProgress = useContext(AuthProgressContext);
  return (
    <div className="container relative flex max-w-[76rem] flex-row justify-between py-4">
      <Link href={landingPage} className="flex flex-row items-center">
        <span className="font-brand text-lg">RestauWants</span>
      </Link>
      <div className="flex flex-row items-center gap-4">
        <Button
          className="h-10"
          variant="ghost"
          onClick={() => authProgress.setIsInProgress?.(true)}
        >
          Sign in
        </Button>
        <Button
          className="h-10"
          variant="outline"
          onClick={() => authProgress.setIsInProgress?.(true)}
        >
          Get started
        </Button>
      </div>
      <div className="absolute inset-x-0 top-full mt-px h-px bg-muted" />
    </div>
  );
};
