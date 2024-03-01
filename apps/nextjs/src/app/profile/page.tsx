import { Suspense } from "react";
import { ExitIcon } from "@radix-ui/react-icons";

import { auth } from "@restauwants/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@restauwants/ui/alert-dialog";

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
    <div className="pb=16 container min-h-screen pt-0">
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="flex h-1/6 max-h-40 flex-row justify-end rounded-b-2xl rounded-t-none bg-gradient-to-r from-primary to-muted p-4">
            <AlertDialog>
              <AlertDialogTrigger>
                <ExitIcon />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Log Out Confirmation</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you absolutely sure you want to Log Out?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>
                    <LogoutButton />
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
