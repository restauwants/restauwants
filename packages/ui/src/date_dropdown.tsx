"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";

interface DateDropdownProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

const DateDropdown: React.FC<DateDropdownProps> = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button>{selectedDate.toDateString()}</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DatePicker selected={selectedDate} onChange={handleChange} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { DateDropdown };
