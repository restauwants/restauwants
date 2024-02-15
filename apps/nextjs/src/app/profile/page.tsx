import { Suspense } from "react";
import { auth } from "@restauwants/auth";
import { AuthShowcase } from "../_components/auth-showcase";
import { api } from "~/trpc/server";
import { PostList } from "../_components/posts";

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
  const posts = api.post.all();

  return (
    <div className="flex h-screen flex-col">
      <div className="relative h-1/4 flex-none rounded-lg bg-muted p-4">
        <div className="absolute bottom-4 left-4">
          <p className="text-2xl font-bold text-primary ">{userId}</p>
        </div>

        <div className="absolute right-4 top-4 p-4">
          <AuthShowcase />
        </div>
      </div>
      <div className="flex-grow p-4">
        <Suspense fallback={<h4>Loading...</h4>}>
          <PostList posts={posts} />
        </Suspense>
      </div>
    </div>
  );
}
