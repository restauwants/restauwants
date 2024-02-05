  import { CreatePostForm } from "../_components/posts";

export default async function Review() {
    return (
        <div className="container min-h-screen py-16">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              Add <span className="text-primary">Review</span>
            </h1>
          <CreatePostForm />
          </div>
        </div>
      );
}
