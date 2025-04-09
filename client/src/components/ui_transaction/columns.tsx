"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { format, addDays } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Transactions } from "./types";

// export type Transactions = {
//   _id: string;
//   date: string;
//   account: string;
//   category: string;
//   description: string;
//   amount: number;
// };

export const columns: ColumnDef<Transactions, unknown>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    //addDays(value, 2), 2 days off from original?
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      const formattedDate = format(addDays(date, 2), "yyyy-MM-dd");
      return <div className="text-center">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "account",
    header: () => <div className="text-center">Account</div>,
  },
  {
    accessorKey: "category",
    header: () => <div className="text-center">Category</div>,
  },
  {
    accessorKey: "description",
    header: () => <div className="text-center">Description</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-center">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "CAD",
      }).format(amount);

      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
];