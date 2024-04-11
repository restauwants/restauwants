import type { Libraries } from "use-google-maps-script";
import { useCallback, useEffect, useState } from "react";
import { useGoogleMapsScript } from "use-google-maps-script";
import usePlacesAutocomplete from "use-places-autocomplete";
import { z } from "zod";

import type { CompletionOption } from "@restauwants/ui/completions";
import { Completions } from "@restauwants/ui/completions";

export type PlaceType = "bar" | "restaurant" | "cafe" | "bakery";

const PlaceSchema = z
  .object({
    place_id: z.string(),
    description: z.string(),
    structured_formatting: z.object({
      main_text: z.string(),
    }),
  })
  .transform((suggestion) => ({
    id: suggestion.place_id,
    address: suggestion.description,
    name: suggestion.structured_formatting.main_text,
  }));

export type Place = z.infer<typeof PlaceSchema>;

interface PropsWithGoogleMapsScript {
  isGoogleMapsScriptLoaded: boolean;
}

const withGoogleMapsScript = <T,>(
  Component: React.ComponentType<T & PropsWithGoogleMapsScript>,
  libraries: Libraries,
) => {
  const ComponentUsingGoogleMapsScript = (props: T) => {
    const { isLoaded } = useGoogleMapsScript({
      googleMapsApiKey: "AIzaSyBhu50DXDGivMJJuglSByZVDGew6ZIVohE",
      libraries,
    });
    return <Component {...props} isGoogleMapsScriptLoaded={isLoaded} />;
  };
  return ComponentUsingGoogleMapsScript;
};

export interface RestaurantSearchBoxWithSuggestionsProps {
  selected?: Place;
  onSelect: (value?: Place) => void;
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
      const [skeletonValue, setSkeletonValue] = useState("");

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
        (place: Place): CompletionOption<Place> => ({
          label: place.address,
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

      const suggestions =
        status === "OK" ? PlaceSchema.array().parse(data) : [];
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
