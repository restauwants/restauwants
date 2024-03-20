import type { FC } from "react";
import type { z } from "zod";
import { useEffect } from "react";

import { useForm } from "@restauwants/ui/form";
import { toast } from "@restauwants/ui/toast";
import {
  EditReviewFormSchema,
  EditReviewSchema,
} from "@restauwants/validators/client";

import { api } from "~/trpc/react";
import { ReviewForm } from "./reviews";

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
}

const EditModal: FC<ModalProps> = ({ isOpen, onClose, review }) => {
  const form = useForm({
    mode: "onBlur",
    schema: EditReviewFormSchema,
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
      form.setValue("rating", review.rating.toString());
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

  const onSubmit = (data: z.input<typeof EditReviewFormSchema>) => {
    updateReview.mutate(
      EditReviewSchema.parse({
        ...data,
        id: review.id,
      }),
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      ></div>
      <div className="z-50 rounded-lg bg-background p-6">
        <div className="flex justify-end">
          <button
            className="text-bold h-7 w-7 rounded-xl bg-accent text-muted-foreground"
            onClick={handleClick}
          >
            X
          </button>
        </div>
        <ReviewForm form={form} onSubmit={onSubmit} />
      </div>
    </div>
  );
};

export default EditModal;
