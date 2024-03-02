import { Suspense } from "react";

import { auth } from "@restauwants/auth";

import { api } from "~/trpc/server";
import { LogoutButton } from "../_components/logoutButton";
import { ReviewList } from "../_components/reviews";

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
    <div className="pb=16 container min-h-dvh pt-0">
      <div className="flex min-h-dvh flex-col items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="flex h-1/6 max-h-40 flex-row justify-end rounded-b-2xl rounded-t-none bg-gradient-to-r from-primary to-muted p-4">
            <LogoutButton />
          </div>

          <div className="border-b-2 p-8">
            <p className="text-2xl font-bold text-primary ">{userId}</p>
            <p className="text-s font-normal">
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
    </div>
  );
}
