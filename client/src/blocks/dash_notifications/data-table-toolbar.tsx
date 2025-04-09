import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { categories } from "@/data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import DeleteConfirmation from "../DeleteConfirmation";

interface NotificationData {
    id: string;
    title: string;
    category: string;
}

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    onDeleteSelected: (selectedIds: string[]) => void; // Update prop to pass selected rows
}

export function DataTableToolbar<TData extends NotificationData>({
    table,
    onDeleteSelected,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    const handleDeleteSelected = () => {
        const selectedRows = table.getSelectedRowModel().rows.map(row => row.original as NotificationData);
        const selectedIds = selectedRows.map(row => row.id);
        onDeleteSelected(selectedIds);
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter notifications"
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("title")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px] border-solid"
                />
                {table.getColumn("category") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("category")}
                        title="Category"
                        options={categories}
                    />
                )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3 border-none bg-white"
                    >
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex items-center space-x-2">
                <DeleteConfirmation
                    onDelete={handleDeleteSelected}
                    targetName="selected notifications"
                    display="Delete all selected"
                />
            </div>
        </div>
    );
}