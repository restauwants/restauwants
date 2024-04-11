import type { Libraries } from "use-google-maps-script";
import type { z } from "zod";
import { useCallback, useEffect, useState } from "react";
import { useGoogleMapsScript } from "use-google-maps-script";
import usePlacesAutocomplete from "use-places-autocomplete";

import type { CompletionOption } from "@restauwants/ui/completions";
import type { PlaceSchema } from "@restauwants/validators/client";
import { Completions } from "@restauwants/ui/completions";
import {
  AddPlaceDescription,
  GoogleApiToPlaceSchema,
} from "@restauwants/validators/client";

import { env } from "~/env";

export type PlaceType = "bar" | "restaurant" | "cafe" | "bakery";

interface PropsWithGoogleMapsScript {
  isGoogleMapsScriptLoaded: boolean;
}

const withGoogleMapsScript = <T,>(
  Component: React.ComponentType<T & PropsWithGoogleMapsScript>,
  libraries: Libraries,
) => {
  const ComponentUsingGoogleMapsScript = (props: T) => {
    const { isLoaded } = useGoogleMapsScript({
      googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
      libraries,
    });
    return <Component {...props} isGoogleMapsScriptLoaded={isLoaded} />;
  };
  return ComponentUsingGoogleMapsScript;
};

export interface RestaurantSearchBoxWithSuggestionsProps {
  selected?: z.infer<typeof PlaceSchema>;
  onSelect: (value?: z.infer<typeof PlaceSchema>) => void;
  types?: PlaceType[];
}

const restaurantSearchPlaceholder = "Find a restaurant";

export const RestaurantSearchBoxWithSuggestions =
  withGoogleMapsScript<RestaurantSearchBoxWithSuggestionsProps>(
    ({
      selected,
      onSelect,
      types = ["bar", "restaurant", "cafe", "bakery"],
      isGoogleMapsScriptLoaded,
    }: RestaurantSearchBoxWithSuggestionsProps & PropsWithGoogleMapsScript) => {
      const [skeletonValue, setSkeletonValue] = useState(
        selected ? AddPlaceDescription.parse(selected).description : "",
      );

      const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        init,
      } = usePlacesAutocomplete({
        requestOptions: {
          types,
        },
        debounce: 300,
        initOnMount: false,
      });

      const placeToOption = useCallback(
        (
          place: z.infer<typeof PlaceSchema>,
        ): CompletionOption<z.infer<typeof PlaceSchema>> => ({
          label: AddPlaceDescription.parse(place).description,
          value: place,
          key: place.id,
        }),
        [],
      );

      useEffect(() => {
        if (isGoogleMapsScriptLoaded) {
          init();
        }
      }, [isGoogleMapsScriptLoaded, init]);

      useEffect(() => {
        if (ready) {
          setValue(skeletonValue);
        }
      }, [ready, skeletonValue, setValue]);

      const suggestions: z.infer<typeof PlaceSchema>[] =
        status === "OK" ? GoogleApiToPlaceSchema.array().parse(data) : [];
      const options = suggestions.map(placeToOption);

      return (
        <Completions
          options={options}
          emptyMessage="No restaurants found"
          placeholder={restaurantSearchPlaceholder}
          selected={selected && placeToOption(selected)}
          value={ready ? value : skeletonValue}
          onChange={ready ? setValue : setSkeletonValue}
          onSelect={(option) => onSelect(option?.value)}
          isLoading={!ready}
        />
      );
    },
    ["places"],
  );
