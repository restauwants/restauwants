"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@restauwants/ui/button";
import { GitHubIcon, ShrimpIcon } from "@restauwants/ui/icons";

import { useDialogOrDrawer } from "~/hooks/dialog-or-drawer";
import { api } from "~/trpc/react";
import { ExamplesBackground } from "./examples-background";
import { Header } from "./header";
import { Hero } from "./hero";
import { ReviewExamples } from "./review-examples";
import { ReviewFormExample } from "./review-form-example";

export default function LandingPage() {
  const dialogOrDrawer = useDialogOrDrawer();
  // TODO: pass initial state from server component and remove disabled state in buttons
  const { data: currentUser } = api.user.currentWithOptionals.useQuery();
  const [
    isSignInOrCreateProfilePopoverOpen,
    setSignInOrCreateProfilePopoverOpen,
  ] = useState(false);

  const githubHref = "https://github.com/restauwants/restauwants";

  return (
    <dialogOrDrawer.Root
      open={isSignInOrCreateProfilePopoverOpen}
      onOpenChange={setSignInOrCreateProfilePopoverOpen}
    >
      <div className="flex flex-col">
        <Header />
        <Hero />
        <ExamplesBackground>
          <ReviewFormExample />
          <ReviewExamples />
        </ExamplesBackground>
        <div className="container flex flex-col items-center pt-20 md:pt-48">
          <div className="relative flex flex-col items-center rounded-2xl border-2 bg-background px-6 py-16 shadow-xl sm:px-10">
            <ShrimpIcon className="absolute -left-[95px] -top-[105px] -z-50 hidden size-52 md:block" />
            <h2 className="text-center text-3xl font-bold sm:text-4xl">
              Why not give it a&nbsp;try?
            </h2>
            <p className="mt-5 text-center leading-snug text-muted-foreground sm:text-lg">
              Create an account and start reviewing, completely&nbsp;free.
            </p>
            <Button variant="primary" className="mt-8 h-10 w-52">
              Start reviewing
            </Button>
          </div>
        </div>
        <div className="container relative mt-24 flex max-w-[76rem] flex-row justify-between pb-20 pt-5">
          <div className="absolute inset-x-0 bottom-full mb-px h-px bg-muted" />
          <p className="text-sm text-muted-foreground">RestauWants</p>
          <Link href={githubHref} rel="noopener noreferrer" target="_blank">
            <GitHubIcon className="fill-muted-foreground" />
          </Link>
        </div>
      </div>
      <dialogOrDrawer.Content>
        {currentUser ? <p>Create profile</p> : <p>Sign in</p>}
      </dialogOrDrawer.Content>
    </dialogOrDrawer.Root>
  );
}
