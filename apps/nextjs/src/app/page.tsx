import Link from "next/link";

import { WavyBackground } from "@restauwants/ui/backgrounds";
import { Button } from "@restauwants/ui/button";

import { landingPage } from "~/app/paths";
import { CreateReviewForm } from "~/components/reviews";
import { withRestrictionsBasedOnSession } from "../actions/navigation";

export default withRestrictionsBasedOnSession(() => {
  return (
    <div className="flex flex-col">
      <div className="container relative flex max-w-[76rem] flex-row justify-between py-4">
        <Link href={landingPage} className="flex flex-row items-center">
          <span className="font-brand text-lg">RestauWants</span>
        </Link>
        <div className="flex flex-row items-center gap-4">
          <Button className="h-10" variant="ghost">
            Sign in
          </Button>
          <Button className="h-10" variant="outline">
            Get started
          </Button>
        </div>
        <div className="absolute inset-x-0 top-full mt-px h-px bg-muted" />
      </div>
      <div className="container flex max-w-[32rem] flex-col items-center pt-24 sm:max-w-[40rem] lg:max-w-[60rem]">
        <h1 className="text-center text-4xl font-bold sm:text-6xl lg:text-7xl/tight">
          A better way to discover and share restaurants
        </h1>
        <p className="mt-5 max-w-[38rem] text-center leading-snug text-muted-foreground sm:text-xl">
          Review your dining experiences, share your findings with friends, and
          receive recommendations from the people you trust&nbsp;most.
        </p>
        <Button variant="primary" className="mt-8 h-10 sm:text-lg">
          Start reviewing for free
        </Button>
      </div>
      <div className="relative pt-[400px]">
        <WavyBackground
          variant={0}
          className="absolute top-32 -z-50 h-36 w-full rotate-180"
        />
        <div className="absolute top-64 -z-50 h-[1300px] w-full bg-secondary" />
        <div className="container flex max-w-[76rem] flex-wrap gap-y-8">
          <div className="w-full sm:w-1/2">
            <h2 className="text-4xl font-bold text-secondary-foreground sm:text-5xl">
              Reviews, created in seconds
            </h2>
            <p className="mt-5 leading-snug text-secondary-foreground/80 sm:text-xl">
              Spend your time on the information that matters most.
            </p>
          </div>
          <div className="w-full rounded-2xl border-2 bg-background p-4 sm:w-1/2">
            <CreateReviewForm skipSubmit />
          </div>
        </div>
      </div>
    </div>
  );
});
