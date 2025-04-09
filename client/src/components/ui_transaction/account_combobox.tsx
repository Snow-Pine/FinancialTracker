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

const accounts = [
  {
    value: "checking",
    label: "Checking",
  },
  {
    value: "saving",
    label: "Saving",
  },
]

interface AccountComboboxProps {
  value: "saving" | "checking";
  onChange: (account: "saving" | "checking") => void;
}

export const AccountCombobox: React.FC<AccountComboboxProps> = ({ value, onChange }) => {
  const [open, setOpen] = React.useState(false)

  const handleAccountChange = (currentValue: string) => {
    const newValue = currentValue as "saving" | "checking";
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
            ? accounts.find((account) => account.value === value)?.label
            : "Select account type"}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[247px] p-0 bg-white">
        <Command>
          <CommandInput placeholder="Search account type" className="h-9" />
          <CommandList>
            <CommandEmpty>No account type found.</CommandEmpty>
            <CommandGroup>
              {accounts.map((account) => (
                <CommandItem
                  key={account.value}
                  value={account.value}
                  onSelect={handleAccountChange}
                >
                  {account.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === account.value ? "opacity-100" : "opacity-0"
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