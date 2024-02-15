import { Suspense } from "react";

import { api } from "~/trpc/server";
import { PostList } from "../_components/posts";

export const runtime = "edge";

export default async function Feed() {
  // You can await this here if you don't want to show Suspense fallback below
  const posts = api.post.all();

  return (
    <div className="container min-h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="border-b-2 text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Restau<span className="text-primary">Wants</span>
        </h1>
        <div className="w-full max-w-2xl">
          <Suspense fallback={<h4>Loading...</h4>}>
            <PostList posts={posts} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
