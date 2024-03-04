import React from "react";

import { GlobeIcon, SewingPinFilledIcon } from "@restauwants/ui/icons";

import { api } from "~/trpc/server";

let map!: google.maps.Map;
const center: google.maps.LatLngLiteral = { lat: 30, lng: -110 };

//Need Restaurant Name from ID through Restaurant DB
//Need google place ID from review

function initMap(): void {
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    center,
    zoom: 8,
  });
}

function getPlaceDetails(placeId: string) {
  const service = new google.maps.places.PlacesService(map);
  const request = {
    placeId,
    fields: ["name", "formatted_address", "formatted_phone_number", "website"],
  };

  service.getDetails(request, (placeResult, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      console.log(placeResult);
      // You can handle the place details here
    } else {
      console.error("Error fetching place details:", status);
    }
  });
}

export default async function RestaurantDetail({
  params,
}: {
  params: { restName: string };
}) {
  const id = parseInt(params.restName);
  const restaurants = await api.restaurant.all();
  const restObj = await api.restaurant.byId({ id });
  console.log(restaurants);
  console.log(restObj?.name);
  return (
    <div className="relative h-screen">
      <div
        className="h-2/5 py-8"
        style={{
          backgroundImage: `url('/pnpm-workspace.jpeg')`,
          backgroundSize: "cover", // Ensure the image covers the entire container
          backgroundRepeat: "no-repeat", // Prevent the image from repeating
          backgroundPosition: "center", // Center the background image
        }}
      ></div>
      <div className="absolute inset-x-0 bottom-0 flex h-2/3 flex-col rounded-t-lg bg-white">
        <div className="mt-8 flex flex-col items-center justify-center">
          <h1 className="font-bold">{params.restName}</h1>
          <div className="mx-auto max-w-md">
            <p className="mx-4 text-center text-sm">
              Pasta dishes & other Italian staples served at this stalwart
              eatery with kitschy decor & live music.
            </p>
          </div>
        </div>
        <div className="relative box-border flex w-full flex-col p-2">
          <div className="flex flex-col border-b-2 pb-2">
            <div className="mt-3 flex items-center gap-1 pt-2">
              <div className="pl-4 text-left ">
                <SewingPinFilledIcon className="h-5 w-5" />
              </div>
              <p className="text-sm text-gray-500">
                1011 Broad St, Victoria, BC V8W 2A1
              </p>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <div className="pl-4 text-left ">
                <GlobeIcon className="h-5 w-5" />
              </div>
              <p className="text-sm text-gray-500">www.restaurant.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
