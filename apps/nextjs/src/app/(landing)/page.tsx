"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { isCompleteUser } from "@restauwants/schema/client";
import { WavyBackground } from "@restauwants/ui/backgrounds";
import { Button } from "@restauwants/ui/button";
import { GitHubIcon, ShrimpIcon } from "@restauwants/ui/icons";

import { landingPage, profilePage } from "~/app/paths";
import { CreateReviewForm } from "~/components/reviews";
import { useDialogOrDrawer } from "~/hooks/dialog-or-drawer";
import { api } from "~/trpc/react";
import { ReviewExamples } from "./review-examples";

export default function LandingPage() {
  const dialogOrDrawer = useDialogOrDrawer();
  // TODO: pass initial state from server component and remove disabled state in buttons
  const { data: currentUser } = api.user.currentWithOptionals.useQuery();
  const [
    isSignInOrCreateProfilePopoverOpen,
    setSignInOrCreateProfilePopoverOpen,
  ] = useState(false);
  const router = useRouter();

  const hasCreatedProfile = currentUser && isCompleteUser(currentUser);

  const handleSignInAndGetStarted = () => {
    if (hasCreatedProfile) {
      router.push(profilePage);
    } else {
      setSignInOrCreateProfilePopoverOpen(true);
    }
  };

  const githubHref = "https://github.com/restauwants/restauwants";

  return (
    <dialogOrDrawer.Root
      open={isSignInOrCreateProfilePopoverOpen}
      onOpenChange={setSignInOrCreateProfilePopoverOpen}
    >
      <div className="flex flex-col">
        <div className="container relative flex max-w-[76rem] flex-row justify-between py-4">
          <Link href={landingPage} className="flex flex-row items-center">
            <span className="font-brand text-lg">RestauWants</span>
          </Link>
          <div className="flex flex-row items-center gap-4">
            <Button
              className="h-10"
              variant="ghost"
              onClick={handleSignInAndGetStarted}
            >
              Sign in
            </Button>
            <Button className="h-10" variant="outline">
              Get started
            </Button>
          </div>
          <div className="absolute inset-x-0 top-full mt-px h-px bg-muted" />
        </div>
        <div className="container flex max-w-[32rem] flex-col items-center pt-24 sm:max-w-[40rem] lg:max-w-[60rem]">
          <h1 className="text-center text-3xl font-bold sm:text-5xl lg:text-6xl/tight">
            A better way to discover and share restaurants
          </h1>
          <p className="mt-5 max-w-[38rem] text-center leading-snug text-muted-foreground sm:text-lg">
            Review your dining experiences, share your findings with friends,
            and receive recommendations from the people you trust&nbsp;most.
          </p>
          <Button variant="primary" className="mt-8 h-10">
            Start reviewing for free
          </Button>
        </div>
        <div className="relative pb-[300px] pt-[500px]">
          <WavyBackground
            variant={0}
            className="absolute top-[180px] -z-50 h-[200px] w-full rotate-180"
          />
          <div className="absolute top-0 -z-40 h-full w-full pb-[199px] pt-[379px]">
            <div className="h-full w-full bg-secondary" />
          </div>
          <WavyBackground
            variant={3}
            className="absolute bottom-0 -z-50 h-[200px] w-full"
          />
          <div className="container grid max-w-[76rem] grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-5">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold text-secondary-foreground sm:text-4xl">
                Reviews, created in seconds
              </h2>
              <p className="mt-5 leading-snug text-secondary-foreground/80 sm:text-lg">
                Spend your time on the information that matters&nbsp;most.
              </p>
            </div>
            <div className="hover:shadow-3xl duration-800 rounded-2xl border-2 bg-background p-4 shadow-xl shadow-primary/10 transition-shadow ease-in-out hover:shadow-primary/20 md:col-span-3">
              <CreateReviewForm skipSubmit />
            </div>
          </div>
          <ReviewExamples />
        </div>
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
