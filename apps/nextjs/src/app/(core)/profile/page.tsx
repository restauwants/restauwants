import { Suspense } from "react";

import { withRestrictionsBasedOnSession } from "~/actions/navigation";
import { api } from "~/trpc/server";
import { ReviewList, ReviewListSkeleton } from "../../../components/reviews";
import { Settings } from "./settings";

export default withRestrictionsBasedOnSession(async () => {
  const user = await api.user.current();
  const reviews = api.review.byUserId({ userId: user.id });

  return (
    <>
      <div className="bg-profile-background absolute -z-50 h-screen w-screen bg-cover bg-right-bottom bg-no-repeat" />
      <div className="container flex flex-row items-start justify-between pt-4">
        <p className="min-w-0 break-words text-2xl font-bold text-primary-foreground">
          {user.username}
        </p>
        <Settings />
      </div>
      <div className="flex w-full flex-col items-center  pb-20 pt-12">
        <div className="container pt-4">
          <Suspense fallback={<ReviewListSkeleton count={3} />}>
            <ReviewList reviews={reviews} byUserId={user.id} />
          </Suspense>
        </div>
      </div>
    </>
  );
});
