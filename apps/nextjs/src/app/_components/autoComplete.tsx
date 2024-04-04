import { ChangeEvent } from "react";
import { Libraries, useGoogleMapsScript } from "use-google-maps-script";
import usePlacesAutocomplete from "use-places-autocomplete";

import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@restauwants/ui/command";

interface ISearchBoxProps {
  onSelectAddress: (address: string, placeID: string) => void;
  defaultValue: string;
}

const libraries: Libraries = ["places"];

export function SearchBox({ onSelectAddress, defaultValue }: ISearchBoxProps) {
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

interface StructuredFormatting {
  main_text: string;
  secondary_text: string;
}

interface dataInterface {
  place_id: string;
  description: string;
  structured_formatting: StructuredFormatting;
}

function ReadySearchBox({ onSelectAddress, defaultValue }: ISearchBoxProps) {
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
            data.map((data: dataInterface) => (
              <CommandItem
                key={data.place_id}
                value={data.description}
                onSelect={() =>
                  handleSelect(
                    data.structured_formatting.main_text,
                    data.place_id,
                  )
                }
                className="bg-white"
              >
                <div className="w-1/2">
                  <b>{data.structured_formatting.main_text}</b>{" "}
                </div>{" "}
                <div className="w-1/2">
                  {data.structured_formatting.secondary_text}
                </div>
              </CommandItem>
            ))}
        </CommandList>
      </Command>

      {/* Other components below */}
    </div>
  );
}
