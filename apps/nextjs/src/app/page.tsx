import Link from "next/link";

import { WavyBackground } from "@restauwants/ui/backgrounds";
import { Button } from "@restauwants/ui/button";

import { landingPage } from "~/app/paths";
import {
  CreateReviewForm,
  ReviewCard,
  ReviewCardSkeleton,
} from "~/components/reviews";
import { api } from "~/trpc/server";
import { withRestrictionsBasedOnSession } from "../actions/navigation";

export default withRestrictionsBasedOnSession(async () => {
  const exampleReviews = await api.review.example.all({ limit: 3 });

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
        <h1 className="text-center text-3xl font-bold sm:text-5xl lg:text-6xl/tight">
          A better way to discover and share restaurants
        </h1>
        <p className="mt-5 max-w-[38rem] text-center leading-snug text-muted-foreground sm:text-lg">
          Review your dining experiences, share your findings with friends, and
          receive recommendations from the people you trust&nbsp;most.
        </p>
        <Button variant="primary" className="sm:text-md mt-8 h-10">
          Start reviewing for free
        </Button>
      </div>
      <div className="relative py-[500px]">
        <WavyBackground
          variant={0}
          className="absolute top-[180px] -z-50 h-[200px] w-full rotate-180"
        />
        <div className="absolute top-0 -z-50 h-full w-full pt-[379px]">
          <div className="h-full w-full bg-secondary" />
        </div>
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
        <div className="container flex max-w-[76rem] flex-col items-center pt-48">
          <h2 className="text-center text-3xl font-bold text-secondary-foreground sm:text-4xl">
            Find out what your friends think
          </h2>
          <p className="mt-5 max-w-[28rem] text-center leading-snug text-secondary-foreground/80 sm:text-lg">
            Discover hidden gems near your home, learn about favorites for your
            next vacation, and&nbsp;more.
          </p>
          <div className="grid w-full grid-cols-1 gap-4 pt-16 md:grid-cols-10 md:grid-rows-4">
            <div className="hover:shadow-3xl duration-800 shadow-xl shadow-primary/10 transition-shadow ease-in-out hover:shadow-primary/20 md:col-start-1 md:col-end-7 md:row-start-1 md:row-end-3">
              {exampleReviews[0] ? (
                <ReviewCard review={exampleReviews[0]} />
              ) : (
                <ReviewCardSkeleton />
              )}
            </div>
            <div className="hover:shadow-3xl duration-800 shadow-xl shadow-primary/10 transition-shadow ease-in-out hover:shadow-primary/20 md:col-start-7 md:col-end-11 md:row-start-2 md:row-end-4">
              {exampleReviews[1] ? (
                <ReviewCard review={exampleReviews[1]} />
              ) : (
                <ReviewCardSkeleton />
              )}
            </div>
            <div className="hover:shadow-3xl duration-800 shadow-xl shadow-primary/10 transition-shadow ease-in-out hover:shadow-primary/20 md:col-start-2 md:col-end-7 md:row-start-3 md:row-end-5">
              {exampleReviews[1] ? (
                <ReviewCard review={exampleReviews[1]} />
              ) : (
                <ReviewCardSkeleton />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
