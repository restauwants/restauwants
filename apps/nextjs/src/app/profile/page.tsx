import { Suspense } from "react";

import { auth } from "@restauwants/auth";

import { api } from "~/trpc/server";
import { AuthShowcase } from "../_components/auth-showcase";
import { ReviewList } from "../_components/reviews";

export async function getUserID() {
  try {
    const session = await auth();

    if (session && session.user) {
      const userId = session.user.name;
      return userId;
    } else {
      throw new Error("User not authenticated");
    }
  } catch (error) {
    const userId = " ";
    return userId;
  }
}

export default async function Profile() {
  const userId = await getUserID();
  const reviews = api.review.all();

  return (
    <div className="flex h-screen flex-col">
      <div className="relative h-1/6 flex-none rounded-b-2xl rounded-t-none bg-gradient-to-r from-primary to-muted p-4">
        <div className="absolute right-4 top-4 p-4">
          <AuthShowcase />
        </div>
      </div>

      <div className="relative h-1/6 flex-none bg-transparent p-4">
        <div className="absolute left-4 top-4">
          <p className="text-2xl font-bold text-primary ">{userId}</p>

          <p className="max-w-screen-md text-xs font-normal sm:max-w-full">
            Lorem ipsum dolor sit amet consectetur. Tincidunt et risus tellus
            orci. Leo imperdiet tortor vel viverra morbi laoreet. Sagittis
            sapien mattis nunc in mi. Dignissim tellus vitae egestas viverra
            augue nibh fames.
          </p>
        </div>
      </div>

      <hr className="my-2 border-b border-muted" />

      <div className="flex-grow p-4">
        <Suspense fallback={<h4>Loading...</h4>}>
          <ReviewList reviews={reviews} />
        </Suspense>
      </div>
    </div>
  );
}
