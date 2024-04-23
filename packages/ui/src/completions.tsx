import type { KeyboardEvent } from "react";
import { useCallback, useRef, useState } from "react";

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
import { CheckIcon } from "./icons";

export interface CompletionOption<T> {
  label: string;
  value: T;
  key: string;
}

interface CompletionsProps<T> {
  options: CompletionOption<T>[];
  emptyMessage?: string;
  selected?: CompletionOption<T>;
  onSelect?: (value?: CompletionOption<T>) => void;
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  filter?: boolean;
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
  filter = false,
}: CompletionsProps<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setOpen] = useState(false);

  const handleChange = useCallback(
    (value: string) => {
      if (value !== selected?.label) {
        onSelect?.(undefined);
      }
      onChange(value);
    },
    [onChange, onSelect, selected],
  );

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
          onSelect?.(optionToSelect);
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

  const handleSelect = useCallback(
    (selectedOption: CompletionOption<T>) => {
      onChange(selectedOption.label);
      onSelect?.(selectedOption);

      // This is a hack to prevent the input from being focused after the user selects an option
      // We can call this hack: "The next tick"
      setTimeout(() => {
        inputRef?.current?.blur();
      }, 0);
    },
    [onSelect, onChange],
  );

  return (
    <Command
      className="overflow-visible"
      onKeyDown={handleKeyDown}
      shouldFilter={filter}
    >
      <CommandInput
        ref={inputRef}
        value={value}
        onValueChange={handleChange}
        onBlur={handleBlur}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        disabled={disabled}
      />
      <div className="relative">
        {isOpen ? (
          <CommandList className="absolute top-0 z-10 w-full rounded-md border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95">
            {isLoading ? (
              <LoadingCompletions />
            ) : (
              <>
                <CompletionsList
                  options={options}
                  selected={selected}
                  onSelect={handleSelect}
                />
                <EmptyCompletions emptyMessage={emptyMessage} />
              </>
            )}
          </CommandList>
        ) : (
          <CommandList />
        )}
      </div>
    </Command>
  );
};

const LoadingCompletions = () => {
  return (
    <CommandLoading>
      <CommandSkeleton>
        <CommandSkeletonContent />
      </CommandSkeleton>
    </CommandLoading>
  );
};

interface EmptyCompletionsProps {
  emptyMessage?: string;
}

const EmptyCompletions = ({ emptyMessage }: EmptyCompletionsProps) => {
  return <CommandEmpty>{emptyMessage}</CommandEmpty>;
};

interface CompletionsListProps<T> {
  options: CompletionOption<T>[];
  selected?: CompletionOption<T>;
  onSelect: (option: CompletionOption<T>) => void;
}

const CompletionsList = <T,>({
  options,
  selected,
  onSelect,
}: CompletionsListProps<T>) => {
  return (
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
            onSelect={() => onSelect(option)}
            className={cn(
              "flex w-full items-center gap-2",
              !isSelected ? "pl-8" : null,
            )}
          >
            {isSelected ? <CheckIcon className="w-4" /> : null}
            {option.label}
          </CommandItem>
        );
      })}
    </CommandGroup>
  );
};
