import { Suspense } from "react";

import { api } from "~/trpc/server";
import { ReviewList } from "../../../components/reviews";

export const runtime = "edge";

export default async function Feed() {
  const reviews = api.review.all();

  return (
    <div className="container min-h-dvh pb-20 pt-12">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Restau<span className="text-primary">Wants</span>
        </h1>
        <div className="w-full">
          <Suspense fallback={<h4>Loading...</h4>}>
            <ReviewList reviews={reviews} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
