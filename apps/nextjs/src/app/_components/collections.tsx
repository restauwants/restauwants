"use client";

import React, { use, useEffect, useRef, useState } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Autocomplete from "react-google-autocomplete";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";

import type { RouterOutputs } from "@restauwants/api";
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
import { ExitIcon, TrashIcon } from "@restauwants/ui/icons";
import { Input } from "@restauwants/ui/input";
import { toast } from "@restauwants/ui/toast";
import {
  AddRestaurantFormSchema,
  AddRestaurantToCollectionFormSchema,
  AddRestaurantToCollectionSchema,
  CreateCollectionFormSchema,
  CreateCollectionSchema,
} from "@restauwants/validators/client";

import { api } from "~/trpc/react";

const APIKEY = process.env.GOOGLE_API_KEY;

export function CollectionList(props: {
  collections: Promise<RouterOutputs["collections"]["all"]>;
}) {
  const initialData = use(props.collections);
  const { data: collections } = api.collections.all.useQuery(undefined, {
    initialData,
  });

  if (collections.length === 0) {
    return (
      <div className="grid grid-cols-3 items-center justify-items-center gap-4 md:grid-cols-5 lg:grid-cols-7">
        <NewCollectionCard></NewCollectionCard>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 items-center justify-items-center gap-4 md:grid-cols-5 lg:grid-cols-7">
      {collections.map((p) => {
        return <CollectionCard name={p.name} id={p.id} />;
      })}
      <NewCollectionCard></NewCollectionCard>
    </div>
  );
}

interface PlacePrediction {
  place_id: string;
  description: string;
}

export function CollectionCard(props: { name: string; id: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlaceDetails, setSelectedPlaceDetails] = useState(null); // Set initial value to null

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedPlaceDetails(null);
  };

  const savePlaceDetailsToState = (details: any) => {
    setSelectedPlaceDetails(details);
  };

  const renderAddRestaurantForm = () => {
    if (selectedPlaceDetails) {
      return (
        <>
          <AddRestaurantToCollectionForm
            CollectionId={props.id}
            RestaurantId={selectedPlaceDetails["place_id"]}
          ></AddRestaurantToCollectionForm>
          <AddRestaurantRestaurantForm
            RestaurantID={selectedPlaceDetails["place_id"]}
            name={selectedPlaceDetails["name"]}
            website={selectedPlaceDetails["website"]}
            formatted_phone_number={
              selectedPlaceDetails["formatted_phone_number"]
            }
            formatted_address={selectedPlaceDetails["formatted_address"]}
          ></AddRestaurantRestaurantForm>
        </>
      );
    } else {
      return (
        <div className="space-y-2 pb-2 pt-2">
          <Button type="submit" className="w-full bg-secondary">
            Add Restaurant
          </Button>
        </div>
      ); // Or you can render a loading indicator here
    }
  };

  const utils = api.useUtils();
  const deleteCollection = api.collections.delete.useMutation({
    onSuccess: async () => {
      await utils.collections.invalidate();
      handleClose();
    },
    onError: (err) => {
      toast.error(
        err?.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to delete a review"
          : "Failed to delete review",
      );
    },
  });

  return (
    <>
      <button
        className="w-20vw h-20vh flex min-h-[100px] min-w-[100px] flex-col items-center justify-center rounded-lg bg-secondary"
        onClick={handleOpen}
      >
        <h4 className="text-center">{props.name}</h4>
      </button>
      {isOpen && (
        <dialog
          open
          className="bg-base fixed inset-0 flex items-center justify-center rounded-xl border border-primary align-top"
        >
          <button className="absolute right-6 top-6" onClick={handleClose}>
            <ExitIcon />
          </button>
          <div className="bg-base items-center justify-center p-8">
            <h2 className="mb-4 text-center align-top text-lg font-semibold">
              {props.name}
            </h2>

            <Autocomplete
              className="bg-base w-full min-w-[250px] rounded-sm border border-primary "
              apiKey="AIzaSyBhu50DXDGivMJJuglSByZVDGew6ZIVohE"
              onPlaceSelected={(place) => {
                savePlaceDetailsToState(place);
              }}
              options={{
                types: ["bakery", "bar", "cafe", "restaurant"],
                fields: [
                  "place_id",
                  "name",
                  "website",
                  "formatted_phone_number",
                  "formatted_address",
                ],
              }}
              placeholder={"Search"}
            ></Autocomplete>
            {renderAddRestaurantForm()}
            <CollectionRestaurantList
              collectionId={props.id}
            ></CollectionRestaurantList>
            <div className="mt-6 flex justify-between rounded-xl">
              <Button
                className="hover:bg-secondary-dark mx-auto rounded bg-secondary px-3 py-2 text-sm text-white"
                onClick={() => deleteCollection.mutate(props.id)}
              >
                Delete Collection
              </Button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}

export function NewCollectionCard() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleFormSubmit = () => {
    handleClose();
  };

  return (
    <>
      <button
        className="w-20vw h-20vh flex min-h-[100px] min-w-[100px] flex-col items-center items-center justify-center rounded-lg border border-primary bg-secondary"
        onClick={handleOpen}
      >
        <p className="text-bold text-2xl">+</p>
        <p className="pt-4 text-xs">New Collection</p>
      </button>

      {isOpen && (
        <dialog
          open
          className="bg-base fixed inset-0 flex h-1/2 w-3/4 items-center justify-center rounded-xl border border-primary"
        >
          <button className="absolute right-6 top-6" onClick={handleClose}>
            <ExitIcon />
          </button>
          <div className="bg-base">
            <h2 className="mb-4 text-center text-lg font-semibold">
              Create New Collection
            </h2>

            <CreateCollectionForm onFormSubmit={handleFormSubmit} />

            <div className="mt-6 flex justify-between rounded-xl"></div>
          </div>
        </dialog>
      )}
    </>
  );
}

interface CreateCollectionFormProps {
  onFormSubmit: () => void;
}

export function CreateCollectionForm({
  onFormSubmit,
}: CreateCollectionFormProps) {
  const form = useForm({
    mode: "onBlur",
    schema: CreateCollectionFormSchema,
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const utils = api.useUtils();

  const createCollection = api.collections.create.useMutation({
    onSuccess: async () => {
      form.reset();
      await utils.collections.invalidate();
      onFormSubmit();
    },
    onError: (err) => {
      toast.error(
        err?.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to create a collection"
          : "Failed to create new collection",
      );
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) =>
          createCollection.mutate(CreateCollectionSchema.parse(data)),
        )}
        className="space-y-5"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collection Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="My Eats" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} placeholder="About this collection...." />
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
//props.RestaurantId - fix parent component to fix this
export function AddRestaurantToCollectionForm(props: {
  CollectionId: number;
  RestaurantId: string;
}) {
  const collection_string: string = props.CollectionId.toString();
  const form = useForm({
    mode: "onBlur",
    schema: AddRestaurantToCollectionFormSchema,
    defaultValues: {
      restaurantId: props.RestaurantId,
      collectionId: collection_string,
    },
  });

  const utils = api.useUtils();
  const addRestaurant = api.collections.addRestaurant.useMutation({
    onSuccess: async () => {
      form.reset();
      await utils.collections.invalidate();
    },
    onError: (err) => {
      toast.error(
        err?.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to add a"
          : "Failed to add restaurant",
      );
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) =>
          addRestaurant.mutate(AddRestaurantToCollectionSchema.parse(data)),
        )}
        className="pt-2"
      >
        <FormField
          control={form.control}
          name="restaurantId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type="hidden" value={props.RestaurantId} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="collectionId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type="hidden" value={collection_string} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full pb-2">
          Add Restaurant
        </Button>
      </form>
    </Form>
  );
}

export function AddRestaurantRestaurantForm(props: {
  RestaurantID: string;
  name: string;
  website: string;
  formatted_phone_number: string;
  formatted_address: string;
}) {
  const form = useForm({
    mode: "onBlur",
    schema: AddRestaurantFormSchema,
    defaultValues: {
      id: props.RestaurantID,
      name: props.name,
      website: props.website || "null",
      formatted_phone_number: props.formatted_phone_number || "null",
      formatted_address: props.formatted_address || "null",
    },
  });

  const utils = api.useUtils();
  const addRestaurant = api.restaurants.create.useMutation({
    onSuccess: async () => {
      form.reset();
      await utils.collections.invalidate();
    },
  });
  useEffect(() => {
    form.handleSubmit(async (data) =>
      addRestaurant.mutate(AddRestaurantFormSchema.parse(data)),
    )();
  }, []);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) =>
          addRestaurant.mutate(AddRestaurantFormSchema.parse(data)),
        )}
        className=""
      >
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type="hidden" value={props.RestaurantID} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type="hidden" value={props.name} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type="hidden" value={props.website} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="formatted_phone_number"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="hidden"
                  value={props.formatted_phone_number}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="formatted_address"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="hidden"
                  value={props.formatted_address}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export function CollectionRestaurantList(props: { collectionId: number }) {
  const {
    data: restaurants,
    isLoading,
    isError,
  } = api.collections.getCollection.useQuery({
    collectionId: props.collectionId,
  });

  return (
    <div className="mx-auto flex h-3/5 max-h-[400px] min-h-[400px] w-5/6 flex-col gap-y-2 overflow-y-auto">
      {restaurants &&
        restaurants.map((restaurant) => (
          <CollectionRestaurantCard
            key={restaurant.restaurantId}
            restaurantId={restaurant.restaurantId}
            collectionId={props.collectionId}
          />
        ))}
    </div>
  );
}

interface CollectionRestaurantCardProps {
  restaurantId: string;
  collectionId: number;
}

export function CollectionRestaurantCard(props: CollectionRestaurantCardProps) {
  const {
    data: restaurant,
    isLoading,
    isError,
  } = api.collections.getRestaurantName.useQuery({
    restaurantId: props.restaurantId,
  });
  const utils = api.useUtils();
  const deleteCollectionRestaurant =
    api.collections.deleteRestaurant.useMutation({
      onSuccess: async () => {
        await utils.collections.invalidate();
      },
      onError: (err) => {
        toast.error(
          err?.data?.code === "UNAUTHORIZED"
            ? "You must be logged in to delete a review"
            : "Failed to delete review",
        );
      },
    });

  return (
    <div className="bg-base relative mt-2 h-[7vh] w-full rounded-xl border border-secondary text-left">
      <p className="p-2 text-sm">{restaurant?.name ?? "Loading..."}</p>
      <Button
        className="absolute bottom-2 right-2 h-3 cursor-pointer text-xs hover:bg-transparent hover:text-white"
        onClick={() =>
          deleteCollectionRestaurant.mutate({
            restaurantId: props.restaurantId,
            collectionId: props.collectionId,
          })
        }
      >
        <TrashIcon />
      </Button>
    </div>
  );
}
