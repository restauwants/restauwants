"use client";

import { useState } from "react";
import Link from "next/link";

import { GitHubIcon } from "@restauwants/ui/icons";

import { useDialogOrDrawer } from "~/hooks/dialog-or-drawer";
import { api } from "~/trpc/react";
import { CallToAction } from "./call-to-action";
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
        <CallToAction />
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
