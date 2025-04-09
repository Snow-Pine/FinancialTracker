import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "@radix-ui/react-icons"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const [open, setOpen] = React.useState(false)

  const handleDateChange = (date: Date | undefined) => {
    console.log("date to be:", date)
    if (date) {
      const adjustedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
      const formattedDate = adjustedDate.toISOString().split('T')[0]
      console.log("formattedDate", formattedDate)
      onChange(formattedDate)
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {value ? format(new Date(addDays(value, 1)), "MMMM/dd/yyyy") : "Pick a date"}
          <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white">
        <Calendar
          mode="single" 
          selected={value ? new Date(addDays(value, 1)) : undefined} 
          onSelect={handleDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}