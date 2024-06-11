"use client";

import { useState } from "react";

import { useDialogOrDrawer } from "~/hooks/dialog-or-drawer";
import { api } from "~/trpc/react";
import { CallToAction } from "./call-to-action";
import { ExamplesBackground } from "./examples-background";
import { Footer } from "./footer";
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
        <Footer />
      </div>
      <dialogOrDrawer.Content>
        {currentUser ? <p>Create profile</p> : <p>Sign in</p>}
      </dialogOrDrawer.Content>
    </dialogOrDrawer.Root>
  );
}
