import { Suspense } from "react";

import { auth } from "@restauwants/auth";

import { api } from "~/trpc/server";
import { LogoutButton } from "../../../components/logoutButton";
import { ReviewList } from "../../../components/reviews";

export async function getUserID() {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }

  return session.user.id;
}

export default async function Profile() {
  // TODO: use user name instead of user id

  const userId = await getUserID();
  const reviews = api.review.all();

  return (
    <div className="container flex min-h-dvh justify-center">
      <div className="w-full max-w-2xl divide-y-2">
        <div>
          <div className="flex flex-row justify-between gap-4 pt-4">
            <p className="text-2xl font-bold text-primary ">{userId}</p>
            <LogoutButton />
          </div>

          <p className="text-s p-4 font-normal">
            Lorem ipsum dolor sit amet consectetur. Tincidunt et risus tellus
            orci. Leo imperdiet tortor vel viverra morbi laoreet. Sagittis
            sapien mattis nunc in mi. Dignissim tellus vitae egestas viverra
            augue nibh fames.
          </p>
        </div>

        <Suspense fallback={<h4>Loading...</h4>}>
          <ReviewList reviews={reviews} />
        </Suspense>
      </div>
    </div>
  );
}
