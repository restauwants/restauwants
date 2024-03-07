import { CreateReviewForm } from "../_components/reviews";

export default async function Review() {
  return (
    <div className="container min-h-screen w-full max-w-lg py-16">
      <CreateReviewForm />
    </div>
  );
}
