import { CreatePostForm } from "../_components/posts";

export default async function Review() {
  return (
    <div className="container min-h-screen py-5">
      <div className="mt-7 flex flex-col gap-3">
        <div className="text-left">
          <h5>I ate at...</h5>
        </div>
        <CreatePostForm />
      </div>
    </div>
  );
}
