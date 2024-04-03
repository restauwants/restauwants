"use client";

import type { z } from "zod";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";

import type { RouterOutputs } from "@restauwants/api";
import { cn } from "@restauwants/ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@restauwants/ui/alert-dialog";
import { Button } from "@restauwants/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@restauwants/ui/card";
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
import {
  CreatePhotosSchema,
  CreateReviewFormSchema,
  CreateReviewSchema,
  EditReviewFormSchema,
  EditReviewSchema,
} from "@restauwants/validators/client";

import { useDialogOrDrawer } from "~/hooks/dialogOrDrawer";
import { api } from "~/trpc/react";
import { SearchBox } from "./autoComplete";

export function CreateReviewForm() {
  const initialState = "";
  const [autocompleteData, setautocompleteData] = useState(initialState);
  const [restoname, setname] = useState(initialState);
  const form = useForm({
    mode: "onBlur",
    schema: ReviewFormSchema,
    defaultValues: {
      restaurantId: "",
      name: "",
      rating: "",
      price: "",
      text: "",
    },
  });

  useEffect(() => {
    // Set the default value once the form is mounted to avoid hydration error
    form.setValue("visitedAt", new Date());
  }, [form]);

  const utils = api.useUtils();

  const createPhotos = api.photo.addPhotosToReview.useMutation({
    onSuccess: async () => {
      await utils.photo.invalidate();
    },
    onError: () => {
      toast.error("Failed to upload photo");
    },
  });

  const uploadPhotos = api.photo.getSignedUploadUrl.useMutation({
    onSuccess: async () => {
      await utils.photo.invalidate();
    },
    onError: () => {
      toast.error("Failed to upload photo");
    },
  });

  // TODO: These things need to move into their own file...
  async function uploadFile(file: File) {
    const presignedUrl = await uploadPhotos.mutateAsync(file.size);
    if (!presignedUrl) {
      throw new Error("Failed to obtain a presigned upload url");
    }
    const res = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
    });
    return res;
  }

  const addPhotosToReview = async (
    urls: string[],
    sizes: number[],
    reviewId: number,
  ) => {
    // 1. Validate lengths of imageUrls and imageSizes clientside?
    if (urls.length !== sizes.length) {
      throw new Error("Image urls and sizes must be the same length");
    }
    const num_uploaded_images = urls.length;

    console.log("num_uploaded_images:", num_uploaded_images);
    // TODO: there's probably an issue if a user gives another user their signed url after they've already created a review...
    const photo_data = {
      reviewId: reviewId,
      signedUrls: urls,
      sizes: sizes,
    };
    // 2. Insert the image into the photos table
    createPhotos.mutate(CreatePhotosSchema.parse(photo_data));
  };

  const createReview = api.review.create.useMutation({
    onSuccess: async () => {
      form.reset();
      await utils.review.invalidate();
      toast.success(`Review created`);
    },
    onError: () => {
      toast.error("Failed to create review");
    },
  });

  const onSubmit = async (data: z.input<typeof ReviewFormSchema>) => {
    const files: FileList = data.files;
    const urls: string[] = [];
    const sizes: number[] = [];
    // Upload every file from the form
    for (const file of files) {
      const res = await uploadFile(file);
      urls.push(res.url);
      sizes.push(file.size);
    }

    // add the review
    try {
      const reviewId = await createReview.mutateAsync(
        
      CreateReviewSchema.parse({
        ...data,
        restaurantId: autocompleteData,
        name: restoname,
      });

      await addPhotosToReview(urls, sizes, reviewId);
    } catch (error) {
      console.error(error);
    } finally {
      console.log("done");
    }
  };

  return (
    <div>
      <div>
        <SearchBox
          onSelectAddress={(address, place_id) => {
            setautocompleteData(place_id);
            setname(address);
          }}
          defaultValue=""
        />
      </div>
      <ReviewForm form={form} onSubmit={onSubmit} />
    </div>
  );
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
              <DatePicker selected={field.value} onSelect={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
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
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input {...field} type="number" placeholder="$23.50" />
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
              <FormLabel>Description</FormLabel>
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
          render={({ field }) => (
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
              {field.value && (
                <div className="flex flex-wrap justify-center gap-1">
                  {Array.from(field.value).map((image: File, i: number) => (
                    <div className="relative h-16 w-16" key={i}>
                      <Image
                        src={URL.createObjectURL(image)}
                        alt="Preview"
                        className="rounded-md"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  ))}
                </div>
              )}
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
    const [reviewToDelete, setReviewToDelete] = useState<
      RouterOutputs["review"]["all"]["reviews"][number] | null
    >(null);

    const editReviewForm = useForm({
      mode: "onBlur",
      schema: ReviewFormSchema,
      defaultValues: {
        id: "",
        restaurantId: "",
        rating: "",
        price: "",
        visitedAt: new Date(),
        text: "",
      },
    });

    const openEditModalFor = (
      review: RouterOutputs["review"]["all"]["reviews"][number],
    ) => {
      editReviewForm.setValue("id", review.id.toString());
      editReviewForm.setValue("restaurantId", review.restaurantId.toString());
      editReviewForm.setValue("rating", review.rating.toString());
      editReviewForm.setValue("price", review.price.toString());
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

    const openDeleteModalFor = (
      review: RouterOutputs["review"]["all"]["reviews"][number],
    ) => {
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
      updateReview.mutate(EditReviewSchema.parse(data));
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
        <AlertDialog
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure about deleting this review?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteReview.mutate(reviewToDelete!.id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  };
}

export const ReviewList = reviewList();

export function ReviewCard(props: {
  review: RouterOutputs["review"]["all"]["reviews"][number];
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
        <div className="border-t" />
        <CardContent className="p-4">
          <div className="grid gap-1.5">
            <CardTitle>
              {props.review.name ?? props.review.restaurantId}
            </CardTitle>
            {props.review.photos.map((photo) => (
              <div className="relative h-96 w-96" key={photo}>
                <Image
                  src={photo}
                  alt="Review photo"
                  fill={true}
                  objectFit="contain"
                />
              </div>
            ))}
            <CardDescription className="whitespace-pre-wrap">
              {props.review.text}
            </CardDescription>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <StarIcon className="h-6 w-6 fill-secondary" />
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
    <Card className="p-0">
      <CardContent className="p-0">
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
        <div className="border-t" />
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
              className={cn(
                "w-full rounded bg-muted",
                pulse && "animate-pulse",
              )}
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
