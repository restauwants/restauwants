import { Suspense } from "react";

import { api } from "~/trpc/server";
import { ReviewList, ReviewListSkeleton } from "../../../components/reviews";

export const runtime = "edge";

export default async function Feed() {
  const reviews = api.review.all({});

  return (
    <>
      <div className="bg-feed-background absolute -z-50 h-full w-screen bg-cover bg-bottom bg-no-repeat" />
      <div className="container min-h-dvh pb-20 pt-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-full">
            <div className="mt-20">
              <Suspense fallback={<ReviewListSkeleton count={3} />}>
                <ReviewList reviews={reviews} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
