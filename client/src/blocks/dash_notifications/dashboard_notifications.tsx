import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Notification } from "@/data/schema";
import { useAuth } from "@/hooks/useAuth";
import { PageLoader } from "@/components/ui/page-loader.tsx";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/dashboard/notifications`;
const CHECK_BALANCE_URL = `${import.meta.env.VITE_SERVER_URL}/dashboard/notifications/check-balance`;

const DashboardNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { loading } = useAuth(); // Use the authentication hook

    // Fetch notifications from the backend
    const fetchNotifications = async () => {
        try {
            const response = await fetch(API_URL, {
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to fetch notifications");
            }
            const data = await response.json();
            setNotifications(data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    // Trigger /check-balance route
    const triggerCheckBalance = async () => {
        try {
            const response = await fetch(CHECK_BALANCE_URL, { method: 'POST' });
            const data = await response.json();
            console.log("Check balance response:", data);
        } catch (error) {
            console.error("Error triggering check balance:", error);
        }
    };

    // Toggle Read Status
    const handleToggleRead = async (id: string) => {
        try {
            // Find the current notification
            const notification = notifications.find((n) => n.id === id);
            if (!notification) return;

            // Toggle the `isRead` value
            const updatedStatus = !notification.isRead;

            // Update the backend
            const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isRead: updatedStatus }),
            });

            if (!response.ok) {
                throw new Error("Failed to update notification status");
            }

            // Update state after successful backend update
            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === id ? { ...n, isRead: updatedStatus } : n
                )
            );
        } catch (error) {
            console.error("Error toggling read status:", error);
        }
    };

    // Handle single delete
    const handleDelete = async (id: string) => {
        try {
            console.log(`Deleting notification with ID: ${id}`);
            const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete notification");
            }
            fetchNotifications(); // Refresh notifications after deletion
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    // Handle bulk delete
    const handleDeleteSelected = async (selectedIds: string[]) => {
        try {
            if (!selectedIds || selectedIds.length === 0) {
                console.warn("No IDs selected for deletion.");
                return;
            }

            console.log(`Deleting notifications with IDs: ${selectedIds}`);
            const response = await fetch(`${API_URL}/bulk-delete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ids: selectedIds }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete selected notifications.");
            }

            fetchNotifications(); // Refresh notifications after deletion
        } catch (error) {
            console.error("Error deleting selected notifications:", error);
        }
    };

    // Initialize function to check balance and fetch notifications
    const initialize = async () => {
        try {
            const lastRunDate = localStorage.getItem('lastCheckBalanceRunDate');
            const today = new Date().toISOString().split('T')[0];

            if (lastRunDate !== today) {
                await triggerCheckBalance();
                localStorage.setItem('lastCheckBalanceRunDate', today);
            }

            await fetchNotifications();
        } catch (error) {
            console.error("Initialization error:", error);
        }
    };

    // TODO: In case demo is needed, remove any saving transac or : 
    // useEffect(() => {
    //     fetchNotifications();
    //     triggerCheckBalance();
    // }, []);

    // Effect to handle mount and unmount
    useEffect(() => {
        initialize();
    }, []);

    if (loading) {
        return <PageLoader />;
    }

    return (
        <div className="h-screen w-full size-full flex-col">
            <div className="mb-4 text-muted-foreground">
                Manage your notifications here.
            </div>
            <DataTable
                data={notifications}
                columns={columns}
                onDelete={handleDelete}
                onDeleteSelected={handleDeleteSelected}
                onToggleRead={handleToggleRead}
            />
        </div>
    );
};

export default DashboardNotifications;
