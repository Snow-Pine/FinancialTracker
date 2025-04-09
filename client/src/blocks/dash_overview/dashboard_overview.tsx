import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import TotalSpendBox from "./TotalSpendBox";
import DashboardOverviewBarGraph from "./dashboard_overview_bar_graph";
import DashboardRecentTransactions from "./DashboardRecentTransactions";
import TotalBalanceBox from "./TotalBalanceBox";
import { useAuth } from "@/hooks/useAuth"; // Import useAuth hook
import { PageLoader } from "@/components/ui/page-loader.tsx";


const DashboardOverview = () => {
    const { loading } = useAuth(); // Use the authentication hook

    if (loading) {
        return <PageLoader />;
    }

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <TotalSpendBox />
                <TotalBalanceBox />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Total Spend over the months</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <DashboardOverviewBarGraph />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        {/* <CardDescription>
                            You recorded 200 transactions this month.
                        </CardDescription> */}
                    </CardHeader>
                    <CardContent>
                        <DashboardRecentTransactions />
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default DashboardOverview