import { Suspense } from "react";

import { WavyBackground } from "@restauwants/ui/backgrounds";

import { withRestrictionsBasedOnSession } from "~/actions/navigation";
import { api } from "~/trpc/server";
import { ReviewList, ReviewListSkeleton } from "../../../components/reviews";

export default withRestrictionsBasedOnSession(() => {
  const reviews = api.review.all({});
  const currentUser = api.user.current();

  return (
    <>
      <div className="flex h-20 w-full justify-center">
        <div className="absolute -z-50 h-28 w-full">
          <WavyBackground variant={1} />
        </div>
        <h1 className="font-brand pt-4 text-4xl text-primary-foreground sm:text-5xl">
          RestauWants
        </h1>
      </div>
      <div className="container max-w-[48rem] pb-20 pt-9">
        <Suspense fallback={<ReviewListSkeleton count={1} />}>
          <ReviewList reviews={reviews} currentUser={currentUser} />
        </Suspense>
      </div>
    </>
  );
});
