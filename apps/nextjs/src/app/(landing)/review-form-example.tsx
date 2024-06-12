import { CreateReviewForm } from "~/components/reviews";

export const ReviewFormExample = () => {
  return (
    <div className="container grid max-w-[76rem] grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-5">
      <div className="md:col-span-2">
        <h2 className="text-3xl font-bold text-secondary-foreground sm:text-4xl">
          Reviews, created in seconds
        </h2>
        <p className="mt-5 leading-snug text-secondary-foreground/80 sm:text-lg">
          Spend your time on the information that matters&nbsp;most.
        </p>
      </div>
      <div className="hover:shadow-3xl duration-800 rounded-2xl border-2 bg-background p-4 shadow-xl shadow-primary/10 transition-shadow ease-in-out hover:shadow-primary/20 md:col-span-3">
        <CreateReviewForm skipSubmit />
      </div>
    </div>
  );
};
