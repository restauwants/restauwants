import { CreateReviewForm } from "../_components/reviews";

export default async function Review() {
  return (
    <div className="container min-h-screen py-5">
      <div className="mt-7 flex flex-col gap-3">
        <CreateReviewForm />
      </div>
    </div>
  );
}
