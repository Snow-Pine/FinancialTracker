import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import SVGCategorySalary from "./svg_category_salary";
import SVGCategoryRetail from "./svg_category_retail";
import SVGCategoryTransportation from "./svg_category_transportation";
import SVGCategoryPersonal from "./svg_category_personal";
import SVGCategoryRestaurant from "./svg_category_restaurant";
import SVGCategoryHealth from "./svg_category_health";
import SVGCategoryOther from "./svg_category_other";

interface Transaction {
    _id: string;
    category: string;
    amount: number;
    description: string;
}

const DashboardRecentTransactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        // Fetch recent transactions from the backend
        const fetchTransactions = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/dashboard/overview/recent-transactions`, {
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data: Transaction[] = await response.json();
                setTransactions(data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, []);

    // Helper function to render icons based on category
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "income":
                return <SVGCategorySalary />;
            case "retail":
                return <SVGCategoryRetail />;
            case "transportation":
                return <SVGCategoryTransportation />;
            case "personal":
                return <SVGCategoryPersonal />;
            case "restaurant":
                return <SVGCategoryRestaurant />;
            case "health":
                return <SVGCategoryHealth />;
            case "other":
                return <SVGCategoryOther />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-8">
            {transactions.length > 0 ? (
                transactions.map((transaction) => (
                    <div className="flex items-center" key={transaction._id}>
                        <Avatar className="h-9 w-9">
                            <AvatarFallback>
                                {getCategoryIcon(transaction.category)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">
                                {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                            </p>
                            <p className="text-sm text-muted-foreground">{transaction.description}</p>
                        </div>
                        <div
                            className={`ml-auto font-medium ${transaction.amount < 0 ? "text-black" : "text-green-500"
                                }`}
                        >
                            {transaction.amount < 0
                                ? `-$${Math.abs(transaction.amount).toFixed(2)}`
                                : `+$${transaction.amount.toFixed(2)}`}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-sm text-muted-foreground">No recent transactions found.</p>
            )}
        </div>
    );
};

export default DashboardRecentTransactions;
