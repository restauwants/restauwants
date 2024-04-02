import { ChangeEvent, FunctionComponent, useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from "@reach/combobox";
import { Libraries, useGoogleMapsScript } from "use-google-maps-script";
import usePlacesAutocomplete, { getDetails } from "use-places-autocomplete";

import "@reach/combobox/styles.css";

import { cn } from "@restauwants/ui";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@restauwants/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@restauwants/ui/popover";

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

    //console.log(place_id);
  };

  //   return (
  //     <Combobox onSelect={handleSelect}>
  //       <ComboboxInput
  //         id="search"
  //         value={value}
  //         onChange={handleChange}
  //         disabled={!ready}
  //         placeholder="Search for restaurant"
  //         className="w-full p-2"
  //         autoComplete="off"
  //       />
  //       <ComboboxPopover>
  //         <li>
  //           {status === "OK" &&
  //             data.map((data) => (
  //               <div key={data.place_id}>{data.structured_formatting.main_text} </div>
  //             ))}
  //         </li>
  //       </ComboboxPopover>
  //     </Combobox>
  //   );
  const [open, setOpen] = useState(false);
  return (
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
      <CommandList>
        {status === "OK" &&
          data.map((data) => (
            <CommandItem
              key={data.place_id}
              value={data.description}
              onSelect={() =>
                handleSelect(
                  data.structured_formatting.main_text,
                  data.place_id,
                )
              }
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
  );
}
