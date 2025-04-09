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

interface Account {
    name: string;
    balance: number;
    color: string;
}

const predefinedAccounts: Account[] = [
    { name: "Checking", balance: 0, color: "#A5D6A7" },
    { name: "Saving", balance: 0, color: "#FFCC80" },
];

const TotalBalanceBox = () => {
    const [accounts, setAccounts] = useState<Account[]>(predefinedAccounts);

    useEffect(() => {
        const fetchAccountData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/dashboard/overview/total-balance`, {
                    credentials: "include",
                });
                const data = await response.json();

                // Update accounts with balances from the API
                const updatedAccounts = predefinedAccounts.map((account) => {
                    const matchedAccount = data.find(
                        (item: { account: string; }) => item.account.toLowerCase() === account.name.toLowerCase()
                    );
                    return {
                        ...account,
                        balance: matchedAccount ? matchedAccount.totalAmount : 0,
                    };
                });
                setAccounts(updatedAccounts);
            } catch (error) {
                console.error("Failed to fetch account data:", error);
            }
        };

        fetchAccountData();
    }, []);

    // Calculate net balance (Savings balance - Checking balance)
    const netBalance = 
        (accounts.find((account) => account.name === "Saving")?.balance || 0) -
        (accounts.find((account) => account.name === "Checking")?.balance || 0);


    return (
        <Card className="w-full max-w-md mx-auto p-6 col-span-3">
            {/* Card Header */}
            <CardHeader className="text-center">
                <CardTitle>Total Balance</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                    Difference of Savings income and Checking expenses
                </CardDescription>
            </CardHeader>

            {/* Card Content */}
            <CardContent className="flex flex-col items-center">
                {/* Doughnut Chart */}
                <div className="w-full flex justify-center">
                    {accounts.length > 0 ? (
                        <DoughnutChart accounts={accounts} />
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>

                {/* Net Balance */}
                <div className="text-4xl font-bold text-primary">
                    <AnimatedCounter amount={netBalance} />
                </div>
            </CardContent>
        </Card>
    );
};

export default TotalBalanceBox;
