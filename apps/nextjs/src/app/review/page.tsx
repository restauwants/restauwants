import { CreatePostForm } from "../_components/posts";

export default async function Review() {
  return (
    <div className="container min-h-screen py-5">
      <div className = "flex justify-between items-center mb-10">
        <h6>cancel</h6>
        <h6>save</h6>
      </div>
      <div className="flex flex-col gap-3">
        <div className = "text-left">
          <h5>I ate at...</h5>
        </div>
        <CreatePostForm />
      </div>
    </div>
  );
}
