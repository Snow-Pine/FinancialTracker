import { UrlTable } from "@/blocks/dash_url/url-table";
import { UrlShortener } from "@/blocks/dash_url/url-shortener";
import { useEffect, useState } from "react";
import { PageLoader } from "@/components/ui/page-loader";

export default function URLPage() {
    const [urlData, setUrlData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/dashboard/share/getUrls`, {
                    credentials: "include",
                });
                const data = await response.json();
                setUrlData(data);
            } catch (error) {
                console.error("Error fetching URLs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleNewUrlData = (newData: any) => {
        setUrlData((prevData) => [...prevData, newData]);
    };

    if (loading) {
        return <PageLoader />;
    }

    return (
        <div className="url-page">
            <UrlShortener onNewUrlData={handleNewUrlData} />
            <br />
            <UrlTable urlData={urlData} setUrlData={setUrlData} />
        </div>
    );
}