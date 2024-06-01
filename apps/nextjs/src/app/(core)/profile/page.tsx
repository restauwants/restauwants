import { Suspense } from "react";

import { WavyBackground } from "@restauwants/ui/backgrounds";

import { withRestrictionsBasedOnSession } from "~/actions/navigation";
import { api } from "~/trpc/server";
import { ReviewList, ReviewListSkeleton } from "../../../components/reviews";
import { Settings } from "./settings";

export default withRestrictionsBasedOnSession(async () => {
  const user = api.user.current();
  const reviews = user.then((user) => api.review.byUserId({ userId: user.id }));

  return (
    <>
      <div className="absolute -z-50 h-28 w-full">
        <WavyBackground variant={0} />
      </div>
      <div className="container flex max-w-[48rem] flex-row items-center justify-between pt-4">
        <span className="min-w-0 break-words text-2xl font-bold text-secondary-foreground">
          {(await user).username}
        </span>
        <Settings />
      </div>
      <div className="container max-w-[48rem] pb-20 pt-16">
        <Suspense fallback={<ReviewListSkeleton count={1} />}>
          <ReviewList
            reviews={reviews}
            currentUser={user}
            byUserId={(await user).id}
          />
        </Suspense>
      </div>
    </>
  );
});
