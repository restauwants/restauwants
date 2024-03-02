import type { FC, ReactNode } from "react";
import { useEffect } from "react";

import { Button } from "@restauwants/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSectionHeader,
  useForm,
} from "@restauwants/ui/form";
import { Input } from "@restauwants/ui/input";
import { toast } from "@restauwants/ui/toast";
import {
  CreateReviewFormSchema,
  CreateReviewSchema,
} from "@restauwants/validators/client";

import { api } from "~/trpc/react";

interface Review {
  restaurantId: number;
  rating: number;
  price: number;
  text: string;
  visitedAt: Date;
  id: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review;
  children: ReactNode;
}

const EditModal: FC<ModalProps> = ({ isOpen, onClose, review }) => {
  const form = useForm({
    mode: "onBlur",
    schema: CreateReviewFormSchema,
    defaultValues: {
      restaurantId: "",
      rating: "",
      price: "",
      visitedAt: new Date().toISOString().split("T")[0],
      text: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.setValue("rating", (review.rating - 1).toString());
      form.setValue("restaurantId", review.restaurantId.toString());
      form.setValue("price", review.price.toString());
      form.setValue("text", review.text);
    }
  }, [form, isOpen, review]);

  const utils = api.useUtils();

  const updateReview = api.review.update.useMutation({
    onSuccess: async () => {
      await utils.review.invalidate();
      onClose();
    },
    onError: (err) => {
      toast.error(
        err?.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to add a review"
          : "Failed to create review",
      );
    },
  });
  const handleClick = () => {
    form.reset();
    onClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  // TODO(#37): retrieve the restaurant name for a restaurant ID
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      ></div>
      <div className="z-50 rounded-lg bg-white p-6">
        <div className="flex justify-end">
          <button
            className="text-bold h-7 w-7 rounded-xl bg-black text-white"
            onClick={handleClick}
          >
            X
          </button>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (data) =>
              updateReview.mutate({
                ...CreateReviewSchema.parse(data),
                id: review.id,
              }),
            )}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="restaurantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restaurant ID</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="7426" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visitedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Visit</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormSectionHeader>Review Details</FormSectionHeader>
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <svg
                        key={index}
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() =>
                          form.setValue("rating", index.toString())
                        }
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <g id="SVGRepo_iconCarrier">
                          <path
                            fill={
                              index <= parseInt(field.value)
                                ? "#E4A72F"
                                : "#808080"
                            }
                            d="M9.88993214,17.5143551 L5.67925514,19.7706633 L5.58137404,19.8151697 C4.86621614,20.0856574 4.19175783,20.0309364 3.67796741,19.5732527 C3.19576628,19.1437087 3.02114918,18.5272631 3.12106237,17.8182442 L3.82494419,12.9582802 L0.644943731,9.61635601 C0.0942731134,9.05561309 -0.12003139,8.36789942 0.0652371375,7.6475266 C0.270499931,6.8494108 0.944591599,6.38981101 1.91626844,6.23594046 L6.1429793,5.59822482 L8.35612232,1.01301762 C8.69987723,0.366097394 9.23663637,-0.0174170702 9.91131194,0.000608459089 C10.5717106,0.0182525484 11.0939504,0.422542671 11.5040044,1.14356762 L13.64475,5.62965664 L18.3837285,6.28808837 C19.1367847,6.41806637 19.6918258,6.81025062 19.9136547,7.46427289 C20.1349495,8.11672079 19.9243574,8.77699895 19.3567704,9.45065589 L15.916492,12.9606774 L16.6886186,17.8170551 C16.81148,18.6567374 16.6644875,19.3222694 16.1027873,19.7179201 C15.5971351,20.0740917 14.964405,20.0740917 14.2364881,19.8236405 L14.1161887,19.7712214 L9.88993214,17.5143551 Z"
                          ></path>
                        </g>
                      </svg>
                    ))}
                  </div>
                  <FormControl>
                    <Input {...field} type="hidden" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="number" placeholder="23.50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="I had a great time at..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditModal;
