import { Suspense } from "react";

import { Button } from "@restauwants/ui/button";

import { api } from "~/trpc/server";
import { ManageFriends } from "../../../components/friends";
import { ReviewList } from "../../../components/reviews";
import { logout } from "../../actions";

export default async function Profile() {
  const username = (await api.user.current()).username;
  const reviews = api.review.all();

  return (
    <div className="container flex min-h-dvh justify-center">
      <div className="w-full max-w-2xl space-y-4 divide-y-2">
        <div className="space-y-4">
          <div className="flex flex-row items-start justify-between gap-4 pt-4">
            <ManageFriends />
            <form>
              <Button size="sm" formAction={logout}>
                Sign Out
              </Button>
            </form>
          </div>
          <p className="text-2xl font-bold text-primary ">{username}</p>
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
