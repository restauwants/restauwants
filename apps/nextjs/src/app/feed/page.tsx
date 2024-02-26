import { Suspense } from "react";

import { api } from "~/trpc/server";
import { getUserID } from "../_components/get_user";
import { ReviewList } from "../_components/reviews";

export const runtime = "edge";

export default async function Feed() {
  // You can await this here if you don't want to show Suspense fallback below
  const reviews = api.review.all();
  const userId: string = getUserID();

  return (
    <div className="container min-h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="border-b-2 text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Restau<span className="text-primary">Wants</span>
        </h1>
        <div className="w-full max-w-2xl">
          <Suspense fallback={<h4>Loading...</h4>}>
            <ReviewList reviews={reviews} curUser={userId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
