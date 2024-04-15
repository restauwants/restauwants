"use client";

import type { z } from "zod";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";

import type { RouterOutputs } from "@restauwants/api";
import type { ReviewSchema } from "@restauwants/schema/client";
import { VisitedAtSchema } from "@restauwants/schema/atoms";
import {
  CreateReviewFormSchema,
  CreateReviewSchema,
  EditReviewFormSchema,
  EditReviewSchema,
} from "@restauwants/schema/client";
import { cn } from "@restauwants/ui";
import { Button } from "@restauwants/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@restauwants/ui/card";
import { ConfirmationDialog } from "@restauwants/ui/confirmation";
import { DatePicker } from "@restauwants/ui/date-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@restauwants/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@restauwants/ui/form";
import {
  CalendarIcon,
  DollarSignIcon,
  DotsVerticalIcon,
  ShrimpIcon,
  StarIcon,
} from "@restauwants/ui/icons";
import { Input } from "@restauwants/ui/input";
import { Textarea } from "@restauwants/ui/textarea";
import { fromNow } from "@restauwants/ui/time";
import { toast } from "@restauwants/ui/toast";
import { ConditionalWrap } from "@restauwants/ui/wrap";

import { useDialogOrDrawer } from "~/hooks/dialogOrDrawer";
import { api } from "~/trpc/react";
import { RestaurantSearchBoxWithSuggestions } from "./restaurants";

export function CreateReviewForm() {
  const form = useForm({
    schema: ReviewFormSchema,
    defaultValues: {
      text: "",
    },
  });

  useEffect(() => {
    // Set the default value once the form is mounted to avoid hydration error
    form.setValue("visitedAt", new Date());
  }, [form]);

  const utils = api.useUtils();

  const createReview = api.review.create.useMutation({
    onSuccess: async () => {
      form.reset();
      form.setValue("visitedAt", new Date());
      await utils.review.invalidate();
      toast.success(`Review created`);
    },
    onError: () => {
      toast.error("Failed to create review");
    },
  });

  const onSubmit = (data: z.input<typeof ReviewFormSchema>) => {
    createReview.mutate(
      CreateReviewSchema.parse({
        restaurantId: data.restaurant.id,
        rating: data.rating,
        price: data.price,
        text: data.text,
        visitedAt: data.visitedAt,
      }),
    );
  };

  return <ReviewForm form={form} onSubmit={onSubmit} />;
}

const ReviewFormSchema = CreateReviewFormSchema.merge(
  EditReviewFormSchema.partial({ id: true }),
);

function ReviewForm({
  form,
  onSubmit,
}: {
  form: ReturnType<typeof useForm<typeof ReviewFormSchema>>;
  onSubmit: (data: z.input<typeof ReviewFormSchema>) => void;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormControl>
              <Input {...field} type="hidden" />
            </FormControl>
          )}
        />
        <FormField
          control={form.control}
          name="restaurant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Restaurant</FormLabel>
              <FormControl>
                <RestaurantSearchBoxWithSuggestions
                  selected={field.value}
                  onSelect={field.onChange}
                />
              </FormControl>
              <FormMessage reserve />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="visitedAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Visit</FormLabel>
              <DatePicker
                selected={field.value}
                onSelect={field.onChange}
                isDateDisabled={(date) =>
                  !VisitedAtSchema.safeParse(date).success
                }
              />
              <FormMessage reserve />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 })
                    .map((_, index) => index + 1)
                    .map((rating) => (
                      <StarIcon
                        key={rating}
                        className={cn(
                          "size-6",
                          rating <= field.value
                            ? "fill-foreground"
                            : "fill-muted",
                        )}
                        onClick={() => field.onChange(rating)}
                      />
                    ))}
                </div>
              </FormControl>
              <FormMessage reserve />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <DollarSignIcon className="size-4" />
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    type="number"
                    placeholder="23.50"
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : undefined,
                      )
                    }
                  />
                </div>
              </FormControl>
              <FormMessage reserve />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  className="h-32 resize-none"
                  {...field}
                  placeholder="How was your experience?"
                />
              </FormControl>
              <FormMessage reserve />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}

function reviewList() {
  const useQuery = (
    initialData: RouterOutputs["review"]["all"],
    byUserId?: string,
  ) => {
    const options = {
      getNextPageParam: (lastPage: RouterOutputs["review"]["all"]) =>
        lastPage.hasMore
          ? lastPage.reviews[lastPage.reviews.length - 1]!.id
          : undefined,
      initialData: {
        pages: [initialData],
        pageParams: [],
      },
    };
    if (byUserId) {
      return () =>
        api.review.byUserId.useInfiniteQuery({ userId: byUserId }, options);
    }
    return () => api.review.all.useInfiniteQuery({}, options);
  };

  return function ReviewList(props: {
    reviews: Promise<RouterOutputs["review"]["all"]>;
    byUserId?: string;
  }) {
    const initialData = use(props.reviews);
    const infiniteReviewsQuery = useQuery(initialData, props.byUserId)();
    const reviews =
      infiniteReviewsQuery.data?.pages.flatMap((page) => page.reviews) ?? [];
    const { data: currentUser } = api.user.current.useQuery();
    const utils = api.useUtils();
    const dialogOrDrawer = useDialogOrDrawer();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [reviewToDelete, setReviewToDelete] =
      useState<z.infer<typeof ReviewSchema>>();

    const editReviewForm = useForm({
      schema: ReviewFormSchema,
    });

    const openEditModalFor = (review: z.infer<typeof ReviewSchema>) => {
      editReviewForm.setValue("id", review.id);
      editReviewForm.setValue("restaurant", {
        id: review.restaurantId,
        name: review.restaurantName,
        address: review.restaurantAddress,
        url: review.restaurantUrl,
      });
      editReviewForm.setValue("rating", review.rating);
      editReviewForm.setValue("price", review.price);
      editReviewForm.setValue("text", review.text);
      editReviewForm.setValue("visitedAt", review.visitedAt);
      setIsEditModalOpen(true);
    };

    const deleteReview = api.review.delete.useMutation({
      onSuccess: async () => {
        await utils.review.invalidate();
        toast.success("Review deleted");
      },
      onError: () => {
        toast.error("Failed to delete review");
      },
    });

    const openDeleteModalFor = (review: z.infer<typeof ReviewSchema>) => {
      setReviewToDelete(review);
      setIsDeleteModalOpen(true);
    };

    const updateReview = api.review.update.useMutation({
      onSuccess: async () => {
        await utils.review.invalidate();
        setIsEditModalOpen(false);
        toast.success("Review updated");
      },
      onError: () => {
        toast.error("Failed to update review");
      },
    });

    const onEditSubmit = (data: z.input<typeof ReviewFormSchema>) => {
      updateReview.mutate(
        EditReviewSchema.parse({
          id: data.id,
          restaurantId: data.restaurant.id,
          rating: data.rating,
          price: data.price,
          text: data.text,
          visitedAt: data.visitedAt,
        }),
      );
    };

    if (reviews.length === 0) {
      return (
        <div className="relative flex w-full flex-col items-center gap-4">
          <div className="mt-20 max-w-xs">
            <div className="mt-20 max-w-xs">
              <p className="text-l text-center">
                Your feed is looking a bit{" "}
                <span className="italic">hungry...</span> maybe it&apos;s time
                to find a place to eat!
              </p>
              <div className="mt-5 flex justify-center">
                <ShrimpIcon className="size-20" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        <InfiniteScroll
          dataLength={reviews.length}
          next={infiniteReviewsQuery.fetchNextPage}
          hasMore={infiniteReviewsQuery.hasNextPage}
          loader={ReviewCardSkeletons(1)}
          className="flex w-full flex-col space-y-6"
        >
          {reviews.map((r) => {
            const isFromCurrentUser = currentUser?.id === r.userId;
            return (
              <ReviewCard
                key={r.id}
                review={r}
                onDelete={
                  isFromCurrentUser ? () => openDeleteModalFor(r) : undefined
                }
                onEdit={
                  isFromCurrentUser ? () => openEditModalFor(r) : undefined
                }
              />
            );
          })}
        </InfiniteScroll>
        <dialogOrDrawer.Root
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
        >
          <dialogOrDrawer.Content>
            <ReviewForm form={editReviewForm} onSubmit={onEditSubmit} />
          </dialogOrDrawer.Content>
        </dialogOrDrawer.Root>
        <ConfirmationDialog
          title="Are you sure about deleting this review?"
          description="This action cannot be undone."
          cancelVerb="Cancel"
          actionVerb="Delete"
          onAction={() => deleteReview.mutate(reviewToDelete!.id)}
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
        />
      </>
    );
  };
}

export const ReviewList = reviewList();

export function ReviewCard(props: {
  review: z.infer<typeof ReviewSchema>;
  onDelete?: () => void;
  onEdit?: () => void;
}) {
  return (
    <Card className="divide-y">
      <CardHeader className="p-0">
        <div className="box-content flex h-5 flex-row items-center gap-4 p-4">
          <div className="min-w-0 break-words text-sm text-muted-foreground">
            {props.review.username}
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="size-4" />
            <span className="text-nowrap">
              {fromNow(props.review.createdAt)}
            </span>
            {(props.onDelete ?? props.onEdit) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <DotsVerticalIcon className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={props.onEdit}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={props.onDelete}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid gap-1.5">
          <CardTitle>
            <ConditionalWrap
              condition={props.review.restaurantUrl !== undefined}
              wrap={(children) => (
                <Link href={props.review.restaurantUrl!}>{children}</Link>
              )}
            >
              {props.review.restaurantName}
            </ConditionalWrap>
          </CardTitle>
          <CardDescription className="whitespace-pre-wrap">
            {props.review.text}
          </CardDescription>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <StarIcon className="size-6 fill-foreground" />
          <div className="text-3xl font-semibold">{props.review.rating}</div>
          <div className="ml-auto flex items-center gap-2">
            <DollarSignIcon className="size-4" />
            <span className="font-semibold">{props.review.price}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReviewCardSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props;
  return (
    <Card className="divide-y">
      <CardHeader className="p-0">
        <div className="box-content h-5 items-center p-4">
          <div
            className={cn(
              "w-20 rounded bg-muted text-sm",
              pulse && "animate-pulse",
            )}
          >
            &nbsp;
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid gap-1.5">
          <CardTitle
            className={cn(
              "w-32 rounded bg-secondary",
              pulse && "animate-pulse",
            )}
          >
            &nbsp;
          </CardTitle>
          <CardDescription
            className={cn("w-full rounded bg-muted", pulse && "animate-pulse")}
          >
            <br />
            <br />
            <br />
          </CardDescription>
        </div>
        <div
          className={cn(
            "mt-4 flex items-center gap-2",
            pulse && "animate-pulse",
          )}
        >
          <div className="w-16 rounded bg-secondary text-3xl">&nbsp;</div>
          <div className="ml-auto flex items-center gap-2">
            <span className="w-20 rounded bg-secondary">&nbsp;</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const ReviewCardSkeletons = (count: number) => {
  return Array.from({ length: count }).map((_, index) => (
    <ReviewCardSkeleton key={index} />
  ));
};

export const ReviewListSkeleton = (props: { count: number }) => (
  <div className="flex w-full flex-col space-y-6">
    {ReviewCardSkeletons(props.count)}
  </div>
);
