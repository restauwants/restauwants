"use client";

import { format } from "date-fns";

import { cn } from ".";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { FormControl } from "./form";
import { CalendarIcon } from "./icons";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const minimumDate = new Date("2000-01-01");

interface DatePickerProps {
  selected: Date;
  onSelect: (date?: Date) => void;
}

export const DatePicker = ({ selected, onSelect }: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn(
              "flex w-[240px] pl-3 text-left font-normal",
              !selected && "text-muted-foreground",
            )}
          >
            {selected ? format(selected, "PPP") : <span>Pick a date</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          disabled={(date) => date > new Date() || date < minimumDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
