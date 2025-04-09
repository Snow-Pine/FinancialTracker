import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import AnimatedCounter from "../AnimatedCounter";
import DoughnutChart from "./DoughnutChart";
import { useEffect, useState } from "react";

interface Category {
    label: string;
    amount: number;
    color: string;
}

// Predefined categories with colors
const predefinedCategories: Category[] = [
    { label: "Retail", amount: 0, color: "#A5D6A7" },
    { label: "Personal", amount: 0, color: "#FFCC80" },
    { label: "Transportation", amount: 0, color: "#90CAF9" },
    { label: "Restaurant", amount: 0, color: "#FFAB91" },
    { label: "Health", amount: 0, color: "#CE93D8" },
    { label: "Other", amount: 0, color: "#B0BEC5" },
];

const TotalSpendBox = () => {
    const [categories, setCategories] = useState<Category[]>(predefinedCategories);
    const [totalSpend, setTotalSpend] = useState<number>(0);

    useEffect(() => {
        // Fetch the total amounts per category from the backend
        const fetchCategoriesSpend = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/dashboard/overview/total-spend`, {
                    credentials: "include",
                });
                const data = await response.json();

                // Map fetched data into predefined categories
                const updatedCategories = predefinedCategories.map((category) => {
                    const matchedCategory = data.find(
                        (item: { category: string; }) => item.category.toLowerCase() === category.label.toLowerCase()
                    );
                    return {
                        ...category,
                        amount: matchedCategory ? matchedCategory.totalAmount : 0, // Use matched amount or default to 0
                    };
                });

                setCategories(updatedCategories);

                // Calculate total spend dynamically (exclude "income" or other non-spending categories if needed)
                const total = updatedCategories.reduce(
                    (sum, category) => sum + category.amount,
                    0
                );
                setTotalSpend(total);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };


        fetchCategoriesSpend();
    }, []);

    return (
        <Card className="w-full max-w-md mx-auto p-6 col-span-4">
            <CardHeader className="text-center">
                <CardTitle>Total Spend</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                    Running amount of expenses from each category
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                {/* Doughnut Chart */}
                <div className="w-full flex justify-center">
                    {categories.length > 0 ? (
                        <DoughnutChart categories={categories} />
                    ) : (
                        <p>Loading...</p> // Show a loading message while fetching data
                    )}
                </div>

                {/* Animated Counter */}
                <div className="text-4xl font-bold text-primary">
                    <AnimatedCounter amount={totalSpend} />
                </div>
            </CardContent>
        </Card>
    );
};

export default TotalSpendBox;
