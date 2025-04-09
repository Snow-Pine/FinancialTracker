"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const categories = [
  {
    value: "retail",
    label: "Retail",
  },
  {
    value: "personal",
    label: "Personal",
  },
  {
    value: "transportation",
    label: "Transportation",
  },
  {
    value: "restaurant",
    label: "Restaurant",
  },
  {
    value: "health",
    label: "Health",
  },
  {
    value: "salary",
    label: "Salary",
  },
  {
    value: "other",
    label: "Other",
  },
]

interface CategoryComboboxProps {
  value: string;
  onChange: (category: string) => void;
}

export const CategoryCombobox: React.FC<CategoryComboboxProps> = ({ value, onChange }) => {
  const [open, setOpen] = React.useState(false)

  const handleCategoryChange = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue;
    onChange(newValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? categories.find((category) => category.value === value)?.label
            : "Select category"}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[247px] p-0 bg-white">
        <Command>
          <CommandInput placeholder="Search category" className="h-9" />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category.value}
                  value={category.value}
                  onSelect={handleCategoryChange}
                >
                  {category.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === category.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}