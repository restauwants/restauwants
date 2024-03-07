import { useState } from "react";
import usePlacesAutocomplete from "use-places-autocomplete";

//callback name for usePlacesAutocomplete is 'callback'
<script
  defer
  src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBhu50DXDGivMJJuglSByZVDGew6ZIVohE&libraries=places&callback=callback"
></script>;

//import useOnclickOutside from "react-cool-onclickoutside";

export const PlacesAutocomplete = () => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    callbackName: "YOUR_CALLBACK_NAME",
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });
  //   const ref = useOnclickOutside(() => {
  //     // When the user clicks outside of the component, we can dismiss
  //     // the searched suggestions by calling this method
  //     clearSuggestions();
  //   });

  const handleInput = (e) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  const handleSelect =
    ({ description }) =>
    () => {
      // When the user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setValue(description, false);
      clearSuggestions();
    };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li key={place_id} onClick={handleSelect(suggestion)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  return (
    <div ref={ref}>
      <input
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Where are you going?"
      />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === "OK" && <ul>{renderSuggestions()}</ul>}
    </div>
  );
};
