import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/utils/utils";
import { buttonVariants } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/Button";

export type EnhancedCalendarProps =
  React.ComponentProps<typeof DayPicker> & {
    yearRange?: { from: number; to: number };
  };

// ✅ FIXED: no CaptionProps (not supported anymore)
type CustomCaptionProps = {
  displayMonth: Date;
  onMonthChange?: (date: Date) => void;
};

function CustomCaption({
  displayMonth,
  onMonthChange,
}: CustomCaptionProps) {
  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: 50 },
    (_, i) => currentYear - 25 + i
  );

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <div className="flex justify-between items-center py-2 px-1">
      {/* Prev */}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          onMonthChange?.(
            new Date(
              displayMonth.getFullYear(),
              displayMonth.getMonth() - 1,
              1
            )
          )
        }
        className="h-7 w-7 p-0 opacity-50 hover:opacity-100"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Month + Year */}
      <div className="flex gap-2">
        <Select
          value={displayMonth.getMonth().toString()}
          onValueChange={(val) =>
            onMonthChange?.(
              new Date(
                displayMonth.getFullYear(),
                Number(val),
                1
              )
            )
          }
        >
          <SelectTrigger className="w-[110px] h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((m, i) => (
              <SelectItem key={i} value={i.toString()}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={displayMonth.getFullYear().toString()}
          onValueChange={(val) =>
            onMonthChange?.(
              new Date(Number(val), displayMonth.getMonth(), 1)
            )
          }
        >
          <SelectTrigger className="w-[80px] h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Next */}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          onMonthChange?.(
            new Date(
              displayMonth.getFullYear(),
              displayMonth.getMonth() + 1,
              1
            )
          )
        }
        className="h-7 w-7 p-0 opacity-50 hover:opacity-100"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

function EnhancedCalendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: EnhancedCalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months:
          "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center mb-4",
        caption_label: "hidden",
        nav: "hidden",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell:
          "h-9 w-9 text-center text-sm p-0 relative",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal"
        ),
        day_selected:
          "bg-primary text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "text-muted-foreground opacity-50",
        day_disabled: "opacity-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Caption: CustomCaption,
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}

EnhancedCalendar.displayName = "EnhancedCalendar";

export { EnhancedCalendar };