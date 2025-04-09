import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHead,
    TableRow,
} from "@/components/ui/table";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { notificationSchema } from "@/data/schema";
import DeleteConfirmation from "../DeleteConfirmation";
import { Checkbox } from "@/components/ui/checkbox";

interface NotificationData {
    id: string;
    title: string;
    category: string;
    isRead: boolean;
}

interface DataTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
    onDelete: (id: string) => void;
    onDeleteSelected: (selectedIds: string[]) => void;
    onToggleRead: (id: string) => void; // New prop for toggling read status
}

export function DataTable<TData extends NotificationData>({
    data,
    columns,
    onDelete,
    onDeleteSelected,
    onToggleRead,
}: DataTableProps<TData>) {
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div>
            <DataTableToolbar table={table} onDeleteSelected={(selectedIds) => {
                onDeleteSelected(selectedIds);
                table.resetRowSelection();
            }} />
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => {
                                const result = notificationSchema.safeParse(row.original);
                                if (!result.success) {
                                    console.error("ZodError:", result.error);
                                    return null;
                                }
                                const notification = result.data;

                                return (
                                    <TableRow
                                        key={row.id}
                                        onClick={() => onToggleRead(notification.id)} // Mark as read
                                        className="cursor-pointer"
                                    >
                                        {/* Circle for unread */}
                                        <TableCell>
                                            {!notification.isRead && (
                                                <div className="h-3 w-3 rounded-full bg-blue-500" />
                                            )}
                                        </TableCell>
                                        {/* Checkbox for selecting the row */}
                                        <TableCell>
                                            <Checkbox
                                                checked={row.getIsSelected()}
                                                onCheckedChange={(value) =>
                                                    row.toggleSelected(!!value)
                                                }
                                                aria-label="Select row"
                                                className="translate-y-[2px]"
                                            />
                                        </TableCell>
                                        {/* Title */}
                                        <TableCell
                                            className={notification.isRead ? "" : "font-bold"}>{notification.id}</TableCell>
                                        <TableCell
                                            className={notification.isRead ? "" : "font-bold" }>
                                                {notification.title}
                                        </TableCell>
                                        {/* Category */}
                                        <TableCell
                                            className={notification.isRead ? "" : "font-bold"}>
                                            {notification.category.charAt(0).toUpperCase() +
                                                notification.category.substring(1).toLowerCase()}
                                        </TableCell>
                                        {/* isRead Status */}
                                        <TableCell
                                            className={notification.isRead ? "" : "font-bold"}>
                                            {notification.isRead ? "Read" : "Unread"}
                                        </TableCell>
                                        {/* Delete Button */}
                                        <TableCell>
                                            <DeleteConfirmation
                                                onDelete={() => onDelete(notification.id)}
                                                targetName="notification"
                                                display="Delete"
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + 1}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
