import type { ChangeEvent } from "react";
import type { Libraries } from "use-google-maps-script";
import { useGoogleMapsScript } from "use-google-maps-script";
import usePlacesAutocomplete from "use-places-autocomplete";
import { z } from "zod";

import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@restauwants/ui/command";

export interface RestaurantSearchBoxProps {
  onSelectAddress: (address: string, placeId: string) => void;
  defaultValue: string;
}

const libraries: Libraries = ["places"];

export function RestaurantSearchBox({
  onSelectAddress,
  defaultValue,
}: RestaurantSearchBoxProps) {
  const { isLoaded, loadError } = useGoogleMapsScript({
    googleMapsApiKey: "AIzaSyBhu50DXDGivMJJuglSByZVDGew6ZIVohE",
    libraries,
  });

  if (!isLoaded) return null;
  if (loadError) return <div>Error loading</div>;

  return (
    <ReadySearchBox
      onSelectAddress={onSelectAddress}
      defaultValue={defaultValue}
    />
  );
}

const SuggestionSchema = z
  .object({
    place_id: z.string(),
    description: z.string(),
    structured_formatting: z.object({
      main_text: z.string(),
      secondary_text: z.string(),
    }),
  })
  .transform((suggestion) => ({
    placeId: suggestion.place_id,
    description: suggestion.description,
    mainText: suggestion.structured_formatting.main_text,
    secondaryText: suggestion.structured_formatting.secondary_text,
  }));

function ReadySearchBox({
  onSelectAddress,
  defaultValue,
}: RestaurantSearchBoxProps) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ["bar", "restaurant", "cafe", "bakery"],
    },
    debounce: 300,
    defaultValue,
  });

  const suggestions = data.map((suggestion) =>
    SuggestionSchema.parse(suggestion),
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (e.target.value === "") {
      onSelectAddress("", "");
    }
  };

  const handleSelect = (address: string, place_id: string) => {
    clearSuggestions();
    setValue(address, false);
    onSelectAddress(address, place_id);
  };

  return (
    <div style={{ position: "relative" }}>
      <Command>
        <CommandInput
          id="search"
          value={value}
          onInput={handleChange}
          disabled={!ready}
          placeholder="Search for restaurant"
          className="w-full p-2"
          autoComplete="off"
        />
        <CommandList className="absolute left-0 top-full z-10">
          {status === "OK" &&
            suggestions.map((suggestion) => (
              <CommandItem
                key={suggestion.placeId}
                value={suggestion.description}
                onSelect={() =>
                  handleSelect(suggestion.mainText, suggestion.placeId)
                }
                className="bg-white"
              >
                <div className="w-1/2">
                  <b>{suggestion.mainText}</b>{" "}
                </div>{" "}
                <div className="w-1/2">{suggestion.secondaryText}</div>
              </CommandItem>
            ))}
        </CommandList>
      </Command>
    </div>
  );
}
