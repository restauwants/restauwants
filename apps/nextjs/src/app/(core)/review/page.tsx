import { CreateReviewForm } from "../../../components/reviews";

export default async function Review() {
  return (
    <div className="container min-h-dvh w-full max-w-lg py-16">
      <CreateReviewForm />
    </div>
  );
}
