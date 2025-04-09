"use client";
import { useState, useEffect } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const DashboardOverviewBarGraph = () => {

    const [monthlyData, setMonthlyData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const API_URL = `${import.meta.env.VITE_SERVER_URL}/dashboard/overview/total-spend/monthly`;

    useEffect(() => {
        // Fetch monthly data for "Checking" transactions
        const fetchMonthlyData = async () => {
            try {
                const response = await fetch(API_URL, {
                    credentials: "include",
                });
                const data = await response.json();
                setMonthlyData(data); // Update state with API data
            } catch (error) {
                console.error("Error fetching monthly totals:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMonthlyData();
    }, []);

    // If data is empty, use placeholder values
    const placeholderData = [
        { name: "Jan", total: 0 },
        { name: "Feb", total: 0 },
        { name: "Mar", total: 0 },
        { name: "Apr", total: 0 },
        { name: "May", total: 0 },
        { name: "Jun", total: 0 },
        { name: "Jul", total: 0 },
        { name: "Aug", total: 0 },
        { name: "Sep", total: 0 },
        { name: "Oct", total: 0 },
        { name: "Nov", total: 0 },
        { name: "Dec", total: 0 },
    ];

    const chartData = monthlyData.length > 0 ? monthlyData : placeholderData;

    return (
        <div style={{ width: "100%", height: 350 }}>
            {isLoading ? (
                // Display a loading spinner or placeholder while loading
                <div className="flex items-center justify-center h-full">
                    <svg
                        className="animate-spin h-8 w-8 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                    </svg>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={chartData}>
                        <XAxis
                            dataKey="month"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Bar
                            dataKey="totalAmount"
                            fill="currentColor"
                            radius={[4, 4, 0, 0]}
                            className="fill-primary"
                        />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default DashboardOverviewBarGraph;
