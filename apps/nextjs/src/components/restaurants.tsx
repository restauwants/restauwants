import type { Libraries } from "use-google-maps-script";
import type { z } from "zod";
import { useCallback, useEffect, useState } from "react";
import { useGoogleMapsScript } from "use-google-maps-script";
import usePlacesAutocomplete from "use-places-autocomplete";

import type { RestaurantSchema } from "@restauwants/schema/client";
import type { CompletionOption } from "@restauwants/ui/completions";
import {
  AddDescriptionToRestaurantSchema,
  GooglePlaceAutocompleteToRestaurantSchema,
} from "@restauwants/schema/client";
import { Completions } from "@restauwants/ui/completions";

import { env } from "~/env";

export type RestaurantType = "bar" | "restaurant" | "cafe" | "bakery";

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
  selected?: z.infer<typeof RestaurantSchema>;
  onSelect: (value?: z.infer<typeof RestaurantSchema>) => void;
  types?: RestaurantType[];
}

const restaurantSearchPlaceholder = "Find a restaurant";
const places: Libraries = ["places"];

export const RestaurantSearchBoxWithSuggestions =
  withGoogleMapsScript<RestaurantSearchBoxWithSuggestionsProps>(
    ({
      selected,
      onSelect,
      types = ["bar", "restaurant", "cafe", "bakery"],
      isGoogleMapsScriptLoaded,
    }: RestaurantSearchBoxWithSuggestionsProps & PropsWithGoogleMapsScript) => {
      const toValue = useCallback(
        (restaurant: z.infer<typeof RestaurantSchema>) =>
          AddDescriptionToRestaurantSchema.parse(restaurant).description,
        [],
      );

      const [skeletonValue, setSkeletonValue] = useState(
        selected ? toValue(selected) : "",
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

      const restaurantToOption = useCallback(
        (
          restaurant: z.infer<typeof RestaurantSchema>,
        ): CompletionOption<z.infer<typeof RestaurantSchema>> => ({
          label: AddDescriptionToRestaurantSchema.parse(restaurant).description,
          value: restaurant,
          key: restaurant.id,
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

      useEffect(() => {
        const value = selected ? toValue(selected) : "";
        if (ready) {
          setValue(value);
        } else {
          setSkeletonValue(value);
        }
      }, [selected, toValue, ready, setValue]);

      const suggestions: z.infer<typeof RestaurantSchema>[] =
        status === "OK"
          ? GooglePlaceAutocompleteToRestaurantSchema.array().parse(data)
          : [];
      const options = suggestions.map(restaurantToOption);

      return (
        <Completions
          options={options}
          emptyMessage="No restaurants found"
          placeholder={restaurantSearchPlaceholder}
          selected={selected && restaurantToOption(selected)}
          value={ready ? value : skeletonValue}
          onChange={ready ? setValue : setSkeletonValue}
          onSelect={(option) => onSelect(option?.value)}
          isLoading={!ready}
        />
      );
    },
    places,
  );
