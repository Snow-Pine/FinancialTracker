"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
    categories?: {
        label: string;
        amount: number;
        color: string;
    }[];
    accounts?: {
        name: string;
        balance: number;
        color: string;
    }[];
}

const DoughnutChart = ({ categories, accounts }: DoughnutChartProps) => {
    // Determine which data to render
    const isCategories = categories && categories.length > 0;
    const isAccounts = accounts && accounts.length > 0;

    const labels = isCategories
        ? categories.map((category) => category.label)
        : isAccounts
            ? accounts.map((account) => account.name)
            : [];

    const dataValues = isCategories
        ? categories.map((category) => category.amount)
        : isAccounts
            ? accounts.map((account) => account.balance)
            : [];

    const backgroundColors = isCategories
        ? categories.map((category) => category.color)
        : isAccounts
            ? accounts.map((account) => account.color)
            : [];

    const data = {
        labels,
        datasets: [
            {
                label: isCategories ? "Running expense" : "Balance",
                data: dataValues,
                backgroundColor: backgroundColors,
            },
        ],
    };

    return (
        <div className="relative w-full">
            <Doughnut
                data={data}
                options={{
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: "right",
                            labels: {
                                usePointStyle: true,
                                boxWidth: 5,
                            },
                        },
                    },
                }}
            />
        </div>
    );
};

export default DoughnutChart;
