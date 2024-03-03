import { Suspense } from "react";

import { auth } from "@restauwants/auth";

import { api } from "~/trpc/server";
import { AddContact } from "../../../components/addContact";
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
      <div className="w-full max-w-2xl space-y-4 divide-y-2">
        <div className="space-y-4">
          <div className="flex flex-row items-start justify-between gap-4 pt-4">
            <AddContact />
            <LogoutButton />
          </div>
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
  );
}
