import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange as CustomDateRange } from "@/types";

interface DateRangePickerProps {
  dateRange: CustomDateRange;
  onDateRangeChange: (range: CustomDateRange) => void;
  className?: string;
}

export default function DateRangePicker({
  dateRange,
  onDateRangeChange,
  className,
}: DateRangePickerProps) {
  // Function to handle date selection
  const handleSelect = (range: DateRange | undefined) => {
    if (range) {
      // Convert the react-day-picker DateRange to our CustomDateRange
      const customRange: CustomDateRange = {
        from: range.from,
        to: range.to
      };
      onDateRangeChange(customRange);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !dateRange?.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "MMMM d, yyyy")} -{" "}
                  {format(dateRange.to, "MMMM d, yyyy")}
                </>
              ) : (
                format(dateRange.from, "MMMM d, yyyy")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from ? dateRange.from : new Date()}
            selected={dateRange}
            onSelect={handleSelect}
            numberOfMonths={2}
            pagedNavigation
            className="border-0 shadow-md"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
