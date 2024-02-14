import { CreatePostForm } from "../_components/posts";

export default async function Review() {
  return (
    <div className="container min-h-screen py-5">
      <div className="mb-10 flex items-center justify-between">
        <h6>cancel</h6>
        <h6>save</h6>
      </div>
      <div className="flex flex-col gap-3">
        <CreatePostForm />
      </div>
    </div>
  );
}
