import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, CaptionProps, useNavigation } from "react-day-picker"

import { cn } from "@/utils/utils"
import { buttonVariants } from "@/components/ui/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/Button"

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  enableDropdownNavigation?: boolean
  yearRange?: { from: number; to: number }
}

// Custom caption component with month/year dropdowns
function EnhancedCaption({ displayMonth, ...props }: CaptionProps) {
  const { goToMonth, previousMonth, nextMonth } = useNavigation()
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 50 }, (_, i) => currentYear - 25 + i)
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const handleMonthChange = (monthIndex: string) => {
    const newMonth = parseInt(monthIndex)
    const newDate = new Date(displayMonth.getFullYear(), newMonth, 1)
    goToMonth(newDate)
  }

  const handleYearChange = (year: string) => {
    const newYear = parseInt(year)
    const newDate = new Date(newYear, displayMonth.getMonth(), 1)
    goToMonth(newDate)
  }

  const goToPreviousMonth = () => {
    if (previousMonth) {
      goToMonth(previousMonth)
    }
  }

  const goToNextMonth = () => {
    if (nextMonth) {
      goToMonth(nextMonth)
    }
  }

  return (
    <div className="flex justify-between items-center py-2 px-1 mb-2">
      <Button
        variant="outline"
        size="sm"
        onClick={goToPreviousMonth}
        className="h-7 w-7 p-0 opacity-50 hover:opacity-100"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex gap-2">
        <Select
          value={displayMonth.getMonth().toString()}
          onValueChange={handleMonthChange}
        >
          <SelectTrigger className="w-[110px] h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((month, index) => (
              <SelectItem key={index} value={index.toString()}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select
          value={displayMonth.getFullYear().toString()}
          onValueChange={handleYearChange}
        >
          <SelectTrigger className="w-[80px] h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={goToNextMonth}
        className="h-7 w-7 p-0 opacity-50 hover:opacity-100"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  enableDropdownNavigation = false,
  yearRange,
  ...props
}: CalendarProps) {
  const calendarClassNames = {
    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
    month: "space-y-4",
    caption: enableDropdownNavigation 
      ? "flex justify-center pt-1 relative items-center"
      : "flex justify-center pt-1 relative items-center",
    caption_label: enableDropdownNavigation ? "hidden" : "text-sm font-medium",
    nav: enableDropdownNavigation ? "hidden" : "space-x-1 flex items-center",
    nav_button: cn(
      buttonVariants({ variant: "outline" }),
      "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
    ),
    nav_button_previous: "absolute left-1",
    nav_button_next: "absolute right-1",
    table: "w-full border-collapse space-y-1",
    head_row: "flex",
    head_cell:
      "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
    row: "flex w-full mt-2",
    cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
    day: cn(
      buttonVariants({ variant: "ghost" }),
      "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
    ),
    day_range_end: "day-range-end",
    day_selected:
      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
    day_today: "bg-accent text-accent-foreground",
    day_outside:
      "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
    day_disabled: "text-muted-foreground opacity-50",
    day_range_middle:
      "aria-selected:bg-accent aria-selected:text-accent-foreground",
    day_hidden: "invisible",
    ...classNames,
  }

  const components = enableDropdownNavigation 
    ? {
        Caption: EnhancedCaption,
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }
    : {
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={calendarClassNames}
      components={components}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
