import { ReviewSchema } from "@restauwants/schema/client";

import { ReviewCard, ReviewCardSkeleton } from "~/components/reviews";

export const ReviewExamples = () => {
  const reviews = [
    {
      id: 1,
      text: "Awesome sandwich bar, right on campus. Has been a game changer for me on the days I don't bring a lunch. I recommend ordering the wrap and packing in all the veggies.",
      rating: 4,
      price: 10.0,
      visitedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      userId: "0",
      username: "daphne",
      restaurantId: "ChIJ_-4oJVpxj1QR9fuYXnfroNg",
      restaurantName: "Mac's",
      restaurantAddress:
        "MacLaurin Building, 3800 Finnerty Rd, Victoria, BC V8P 4X2, Canada",
      restaurantUrl: "https://maps.google.com/?cid=15609735206386858997",
    },
    {
      id: 2,
      text: "The sushi here is incredible. Arrive around 4:00 pm and wait in line to get 50% off! The caterpillar roll was my personal fave.",
      rating: 5,
      price: 46.0,
      visitedAt: new Date(Date.now() - 1000 * 60 * 3),
      createdAt: new Date(Date.now() - 1000 * 60 * 3),
      updatedAt: new Date(Date.now() - 1000 * 60 * 3),
      userId: "1",
      username: "aliya",
      restaurantId: "ChIJm6YnFHPQVHkRr1Vb5CAN2Ew",
      restaurantName: "Sansei Seafood Restaurant & Sushi Bar",
      restaurantAddress: '1819 S Kihei Rd Building "A, Kihei, HI 96753, USA',
      restaurantUrl: "https://maps.google.com/?cid=5537190176773330351",
    },
    {
      id: 3,
      text: "Beautiful building, right in the middle of ByWard Market. I ordered the jerk chicken sandwich and enjoyed it - the pineapple-kiwi salsa was yummy. I'll be coming back soon to try and get a seat on their balcony!",
      rating: 4,
      price: 36.0,
      visitedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "2",
      username: "louis",
      restaurantId: "ChIJTZABIwIFzkwR-T2FWcHUN2k",
      restaurantName: "Aulde Dubliner & Pour House - ByWard Market, Ottawa ON",
      restaurantAddress: "62 William St, Ottawa, ON K1N 7A3, Canada",
      restaurantUrl: "https://maps.google.com/?cid=7581762424597200377",
    },
  ].map((r) => ReviewSchema.parse(r));
  return (
    <div className="container flex max-w-[76rem] flex-col items-center pt-48">
      <h2 className="text-center text-3xl font-bold text-secondary-foreground sm:text-4xl">
        Find out what your friends think
      </h2>
      <p className="mt-5 max-w-[28rem] text-center leading-snug text-secondary-foreground/80 sm:text-lg">
        Discover hidden gems near your home, learn about favorites for your next
        vacation, and&nbsp;more.
      </p>
      <div className="grid w-full grid-cols-1 gap-x-16 gap-y-4 pt-16 md:grid-cols-10 md:grid-rows-4 md:gap-y-16">
        <div className="md:col-start-1 md:col-end-7 md:row-start-1 md:row-end-3">
          <div className="hover:shadow-3xl duration-800 shadow-xl shadow-primary/10 transition-shadow ease-in-out hover:shadow-primary/20">
            {reviews[0] ? (
              <ReviewCard review={reviews[0]} />
            ) : (
              <ReviewCardSkeleton />
            )}
          </div>
        </div>
        <div className="md:col-start-7 md:col-end-11 md:row-start-2 md:row-end-4">
          <div className="hover:shadow-3xl duration-800 shadow-xl shadow-primary/10 transition-shadow ease-in-out hover:shadow-primary/20">
            {reviews[1] ? (
              <ReviewCard review={reviews[1]} />
            ) : (
              <ReviewCardSkeleton />
            )}
          </div>
        </div>
        <div className="md:col-start-2 md:col-end-7 md:row-start-3 md:row-end-5">
          <div className="hover:shadow-3xl duration-800 shadow-xl shadow-primary/10 transition-shadow ease-in-out hover:shadow-primary/20">
            {reviews[2] ? (
              <ReviewCard review={reviews[2]} />
            ) : (
              <ReviewCardSkeleton />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
