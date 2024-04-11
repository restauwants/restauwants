import type { Libraries } from "use-google-maps-script";
import { useCallback } from "react";
import { useGoogleMapsScript } from "use-google-maps-script";
import usePlacesAutocomplete from "use-places-autocomplete";
import { z } from "zod";

import type { CompletionOption } from "@restauwants/ui/completions";
import { Completions, CompletionsSkeleton } from "@restauwants/ui/completions";

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

const withGoogleMapsScript = <T extends object>(
  Component: React.ComponentType<T>,
  Fallback: React.ComponentType,
  libraries: Libraries,
) => {
  const ComponentUsingGoogleMapsScript = (props: T) => {
    const { isLoaded } = useGoogleMapsScript({
      googleMapsApiKey: "AIzaSyBhu50DXDGivMJJuglSByZVDGew6ZIVohE",
      libraries,
    });

    if (!isLoaded) {
      return <Fallback />;
    }

    return <Component {...props} />;
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
    }: RestaurantSearchBoxWithSuggestionsProps) => {
      const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
      } = usePlacesAutocomplete({
        requestOptions: {
          types,
        },
        debounce: 300,
      });

      const placeToOption = useCallback(
        (place: Place): CompletionOption<Place> => ({
          label: place.address,
          value: place,
          key: place.id,
        }),
        [],
      );

      const suggestions =
        status === "OK" ? PlaceSchema.array().parse(data) : [];
      const options = suggestions.map(placeToOption);

      return (
        <Completions
          options={options}
          emptyMessage="No restaurants found"
          placeholder={restaurantSearchPlaceholder}
          disabled={!ready}
          selected={selected && placeToOption(selected)}
          value={value}
          onChange={setValue}
          onSelect={(option) => onSelect(option?.value)}
        />
      );
    },
    () => <CompletionsSkeleton placeholder={restaurantSearchPlaceholder} />,
    ["places"],
  );
