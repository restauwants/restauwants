import { Suspense } from "react";

import { api } from "~/trpc/server";
import { ReviewList, ReviewListSkeleton } from "../../../components/reviews";
import { More } from "./more";

export default async function Profile() {
  const user = await api.user.current();
  const reviews = api.review.byUserId({ userId: user.id });

  return (
    <div className="flex min-h-dvh w-full flex-col items-center space-y-4 divide-y-2 pb-20 pt-12">
      <div className="container flex flex-row items-start justify-between gap-5 pt-4">
        <p className="min-w-0 break-words text-2xl font-bold text-primary">
          {user.username}
        </p>
        <More />
      </div>
      <div className="container pt-4">
        <Suspense fallback={<ReviewListSkeleton count={3} />}>
          <ReviewList reviews={reviews} byUserId={user.id} />
        </Suspense>
      </div>
    </div>
  );
}
