import type { KeyboardEvent } from "react";
import { useCallback, useRef, useState } from "react";
import { Check } from "lucide-react";

import { cn } from ".";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  CommandSkeleton,
  CommandSkeletonContent,
} from "./command";

export interface CompletionOption<T> {
  label: string;
  value: T;
  key: string;
}

interface CompletionsProps<T> {
  options: CompletionOption<T>[];
  emptyMessage: string;
  selected?: CompletionOption<T>;
  onSelect: (value?: CompletionOption<T>) => void;
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export const Completions = <T,>({
  options,
  placeholder,
  emptyMessage,
  selected,
  onSelect,
  value,
  onChange,
  disabled,
  isLoading = false,
}: CompletionsProps<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setOpen] = useState(false);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;

      if (!input) {
        return;
      }

      // Keep the options displayed when the user is typing
      if (!isOpen) {
        setOpen(true);
      }

      if (event.key === "Enter" && input.value !== "") {
        const optionToSelect = options.find(
          (option) => option.label === input.value,
        );
        if (optionToSelect) {
          onSelect(optionToSelect);
        }
      }

      if (event.key === "Escape") {
        input.blur();
      }
    },
    [isOpen, options, onSelect],
  );

  const handleBlur = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSelectOption = useCallback(
    (selectedOption: CompletionOption<T>) => {
      onChange(selectedOption.label);
      onSelect(selectedOption);

      // This is a hack to prevent the input from being focused after the user selects an option
      // We can call this hack: "The next tick"
      setTimeout(() => {
        inputRef?.current?.blur();
      }, 0);
    },
    [onSelect, onChange],
  );

  return (
    <Command className="overflow-visible" onKeyDown={handleKeyDown}>
      <div>
        <CommandInput
          ref={inputRef}
          value={value}
          onValueChange={isLoading ? undefined : onChange}
          onBlur={handleBlur}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
      <div className="relative mt-1">
        {isOpen ? (
          <CommandList className="absolute top-0 z-10 w-full rounded-md border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95">
            {isLoading ? (
              <CommandLoading>
                <CommandSkeleton>
                  <CommandSkeletonContent />
                </CommandSkeleton>
              </CommandLoading>
            ) : null}
            {options.length > 0 && !isLoading ? (
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selected?.key == option.key;
                  return (
                    <CommandItem
                      key={option.key}
                      value={option.label}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      onSelect={() => handleSelectOption(option)}
                      className={cn(
                        "flex w-full items-center gap-2",
                        !isSelected ? "pl-8" : null,
                      )}
                    >
                      {isSelected ? <Check className="w-4" /> : null}
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ) : null}
            {!isLoading ? <CommandEmpty>{emptyMessage}</CommandEmpty> : null}
          </CommandList>
        ) : null}
      </div>
    </Command>
  );
};
