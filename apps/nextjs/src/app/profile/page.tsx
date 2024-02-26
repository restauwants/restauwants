import { Suspense } from "react";

import { api } from "~/trpc/server";
import { getUserID } from "../_components/get_user";
import { LogoutButton } from "../_components/logoutButton";
import { ReviewList } from "../_components/reviews";

export default async function Profile() {
  // TODO: use user name instead of user id

  const reviews = api.review.all();
  const userId: string = getUserID();

  return (
    <div className="pb=16 container min-h-screen pt-0">
      <div className="flex min-h-screen flex-col items-center justify-center">
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
            <ReviewList reviews={reviews} curUser={userId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
