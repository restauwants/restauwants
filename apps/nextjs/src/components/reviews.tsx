"use client";

import type { z } from "zod";
import { use, useState } from "react";

import type { RouterOutputs } from "@restauwants/api";
import { cn } from "@restauwants/ui";
import { Button } from "@restauwants/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@restauwants/ui/card";
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
  FormSectionHeader,
  useForm,
} from "@restauwants/ui/form";
import {
  CalendarIcon,
  DollarSignIcon,
  DotsVerticalIcon,
  StarIcon,
} from "@restauwants/ui/icons";
import { Input } from "@restauwants/ui/input";
import { Dialog, DialogContent } from "@restauwants/ui/modal";
import { Textarea } from "@restauwants/ui/textarea";
import { fromNow } from "@restauwants/ui/time";
import { toast } from "@restauwants/ui/toast";
import {
  CreatePhotosSchema,
  CreateReviewFormSchema,
  CreateReviewSchema,
  EditReviewFormSchema,
  EditReviewSchema,
} from "@restauwants/validators/client";

import { moveFileIfVerified, verifySignedUrl } from "~/app/upload/actions";
import { uploadFile } from "~/app/upload/page";
import { api } from "~/trpc/react";

export function CreateReviewForm() {
  const form = useForm({
    mode: "onBlur",
    schema: ReviewFormSchema,
    defaultValues: {
      restaurantId: "",
      rating: "",
      price: "",
      visitedAt: new Date().toISOString().split("T")[0],
      text: "",
    },
  });

  const utils = api.useUtils();

  const createPhotos = api.photo.multiCreate.useMutation({
    onSuccess: async () => {
      await utils.photo.invalidate();
    },
    onError: () => {
      toast.error("Failed to upload photo");
    },
  });

  const addPhotosToReview = async (
    urls: string[],
    sizes: number[],
    reviewId: number,
  ) => {
    // 1. Validate lengths of imageUrls and imageSizes
    if (urls.length !== sizes.length) {
      throw new Error("Image urls and sizes must be the same length");
    }
    const num_uploaded_images = urls.length;

    console.log("num_uploaded_images:", num_uploaded_images);
    // 2. Verify the user's signed urls are legitimate
    // TODO: there's probably an issue if a user gives another user their signed url after they've already created a review...
    const uploadedImageNames: string[] = [];
    for (let i = 0; i < num_uploaded_images; i++) {
      console.log("this is the url marked as invalid:", urls[i]!);
      console.log("this is its size:", sizes[i]!);
      const verified = await verifySignedUrl(urls[i]!, sizes[i]!);
      if (!verified) {
        throw new Error("Invalid signed URL");
      }

      // 3. Move the images referred to by the signed urls to the restauwants bucket (if they exist)
      // this should fail if the image doesn't exist in the staging bucket?
      void (await moveFileIfVerified(
        urls[i]!,
        sizes[i]!,
        "restauwants_staging",
        "restauwants",
      ));
      // Get the image name
      const url = new URL(urls[i]!);
      const imageName = url.pathname.split("/").pop()!;
      uploadedImageNames.push(imageName);
    }
    const photo_data = {
      reviewId: reviewId,
      ids: uploadedImageNames,
    };
    // 4. Insert the image into the photos table
    console.log("trying to insert");
    createPhotos.mutate(CreatePhotosSchema.parse(photo_data));
  };

  const createReview = api.review.create.useMutation({
    onSuccess: async () => {
      form.reset();
      await utils.review.invalidate();
    },
    onError: () => {
      toast.error("Failed to create review");
    },
  });

  const onSubmit = async (data: z.input<typeof ReviewFormSchema>) => {
    const files: FileList = data.files;
    const urls: string[] = [];
    const sizes: number[] = [];
    for (const file of files) {
      const res = await uploadFile(file);
      urls.push(res.url);
      sizes.push(file.size);
    }

    // add the review
    try {
      const reviewId = await createReview.mutateAsync(
        CreateReviewSchema.parse(data),
      );
      await addPhotosToReview(urls, sizes, reviewId);
    } catch (error) {
      console.error(error);
    } finally {
      console.log("done");
    }
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
  // TODO(#37): retrieve the restaurant name for a restaurant ID
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                {Array.from({ length: 5 })
                  .map((_, index) => index + 1)
                  .map((index) => (
                    <svg
                      key={index}
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => form.setValue("rating", index.toString())}
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
                <Textarea
                  className="h-32 resize-none"
                  {...field}
                  placeholder="I had a great time at..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="files"
          render={() => (
            <FormItem>
              <FormControl>
                <Input
                  type="file"
                  accept="image/x-png,image/jpeg,image/gif"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) form.setValue("files", e.target.files);
                  }}
                />
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
  );
}

function reviewList() {
  const useQuery = (
    initialData: RouterOutputs["review"]["all"],
    byUserId?: string,
  ) => {
    if (byUserId) {
      return () =>
        api.review.byUserId.useQuery({ userId: byUserId }, { initialData });
    }
    return () => api.review.all.useQuery(undefined, { initialData });
  };

  return function ReviewList(props: {
    reviews: Promise<RouterOutputs["review"]["all"]>;
    byUserId?: string;
  }) {
    // TODO: Make `useSuspenseQuery` work without having to pass a promise from RSC
    const initialData = use(props.reviews);
    const { data: reviews } = useQuery(initialData, props.byUserId)();
    const { data: currentUser } = api.user.current.useQuery();
    const utils = api.useUtils();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const editReviewForm = useForm({
      mode: "onBlur",
      schema: ReviewFormSchema,
      defaultValues: {
        id: "",
        restaurantId: "",
        rating: "",
        price: "",
        visitedAt: new Date().toISOString().split("T")[0],
        text: "",
      },
    });

    const openEditModalFor = (
      review: RouterOutputs["review"]["all"][number],
    ) => {
      editReviewForm.setValue("id", review.id.toString());
      editReviewForm.setValue("restaurantId", review.restaurantId.toString());
      editReviewForm.setValue("rating", review.rating.toString());
      editReviewForm.setValue("price", review.price.toString());
      editReviewForm.setValue("text", review.text);
      editReviewForm.setValue(
        "visitedAt",
        review.visitedAt.toISOString().split("T")[0]!,
      );
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
      updateReview.mutate(EditReviewSchema.parse(data));
    };

    if (reviews.length === 0) {
      return (
        <div className="relative flex w-full flex-col items-center gap-4">
          <div className="mt-20 max-w-xs">
            <p className="text-center">
              Your feed is looking a bit{" "}
              <span className="italic">hungry...</span> maybe it&apos;s time to
              find a place to eat!
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex w-full flex-col space-y-6">
        {reviews.map((p) => {
          const isFromCurrentUser = currentUser?.id === p.userId;
          return (
            <ReviewCard
              key={p.id}
              review={p}
              onDelete={
                isFromCurrentUser ? () => deleteReview.mutate(p.id) : undefined
              }
              onEdit={isFromCurrentUser ? () => openEditModalFor(p) : undefined}
            />
          );
        })}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <ReviewForm form={editReviewForm} onSubmit={onEditSubmit} />
          </DialogContent>
        </Dialog>
      </div>
    );
  };
}

export const ReviewList = reviewList();

export function ReviewCard(props: {
  review: RouterOutputs["review"]["all"][number];
  onDelete?: () => void;
  onEdit?: () => void;
}) {
  // TODO(#37): retrieve the restaurant name for a restaurant ID
  return (
    <Card className="p-0">
      <CardContent className="p-0">
        <div className="box-content flex h-5 flex-row items-center gap-4 p-4">
          <div className="min-w-0 break-words text-sm text-muted-foreground">
            {props.review.username}
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
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
                  <DropdownMenuItem onClick={props.onDelete}>
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={props.onEdit}>
                    Edit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <div className="border-t" />
        <CardContent className="p-4">
          <div className="grid gap-1.5">
            <CardTitle>{props.review.restaurantId}</CardTitle>
            <CardDescription className="whitespace-pre-wrap">
              {props.review.text}
            </CardDescription>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <StarIcon className="h-6 w-6 fill-primary" />
            <div className="text-3xl font-semibold">{props.review.rating}</div>
            <div className="ml-auto flex items-center gap-2">
              <DollarSignIcon className="h-4 w-4" />
              <span className="font-semibold">{props.review.price}</span>
            </div>
          </div>
        </CardContent>
      </CardContent>
    </Card>
  );
}

export function ReviewCardSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props;
  return (
    <div className="flex flex-row rounded-lg bg-muted p-4">
      <div className="flex-grow">
        <h2
          className={cn(
            "w-1/4 rounded bg-primary text-2xl font-bold",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </h2>
        <p
          className={cn(
            "mt-2 w-1/3 rounded bg-current text-sm",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </p>
      </div>
    </div>
  );
}
