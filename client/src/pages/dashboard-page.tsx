import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import { HandHeart } from "lucide-react"

import DashboardOverview from "@/blocks/dash_overview/dashboard_overview";
import DashboardNotifications from "@/blocks/dash_notifications/dashboard_notifications";
import DashboardGoals from "@/blocks/dash_goals/dashboard_goals";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";


export default function DashboardPage() {
    const [referDrawerOpen, setReferDrawerOpen] = useState(false); // State for the refer drawer
    const [shortUrl, setShortUrl] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get("tab") || "overview";

    const [activeTab, setActiveTab] = useState(initialTab);
    const handleTabChange = (value: string) => {
        setActiveTab(value);
        navigate(`?tab=${value}`); // Update the URL to reflect the active tab
    };

    const fetchOverviewData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/dashboard/overview`, {
                credentials: "include",
            });
            await response.json();
        } catch (error) {
            console.error("Error fetching overview data:", error);
        }
    };

    const fetchGoalsData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/dashboard/goals`, {
                credentials: "include",
            });
            await response.json();
        } catch (error) {
            console.error("Error fetching goals data:", error);
        }
    };

    const fetchNotificationsData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/dashboard/notifications`, {
                credentials: "include",
            });
            await response.json();
        } catch (error) {
            console.error("Error fetching notifications data:", error);
        }
    };

    useEffect(() => {
        const overviewTrigger = document.querySelector('[data-value="overview"]');
        const goalsTrigger = document.querySelector('[data-value="goals"]');
        const notificationsTrigger = document.querySelector('[data-value="notifications"]');

        if (overviewTrigger) {
            overviewTrigger.addEventListener("click", fetchOverviewData);
        }

        if (goalsTrigger) {
            goalsTrigger.addEventListener("click", fetchGoalsData);
        }

        if (notificationsTrigger) {
            notificationsTrigger.addEventListener("click", fetchNotificationsData);
        }

        return () => {
            if (overviewTrigger) {
                overviewTrigger.removeEventListener("click", fetchOverviewData);
            }
            if (goalsTrigger) {
                goalsTrigger.removeEventListener("click", fetchGoalsData);
            }
            if (notificationsTrigger) {
                notificationsTrigger.removeEventListener("click", fetchNotificationsData);
            }
        };
    }, []);

    const handleReferClick = async () => {
        const longURL = window.location.href;
        const title = "Refer to friend";
        const createdDate = new Date();

        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/dashboard/share/shortenUrl`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ longURL, title, createdDate }),
        });

        if (response.ok) {
            const data = await response.json();
            setShortUrl(data.shortURL);
            setReferDrawerOpen(true);
        } else {
            alert("Failed to create short URL");
        }
    };

    const handleShortUrlClick = async (shortUrl: string) => {
        const shortId = shortUrl.split("/").pop();
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/dashboard/share/url/${shortId}`, {
            credentials: "include",
        });
        if (response.ok) {
            const longUrl = await response.text();
            window.open(longUrl, "_blank");
        } else {
            alert("Failed to redirect to the long URL");
        }
    };

    const shareOnPlatform = (platform: string) => {
        let shareUrl = "";
        switch (platform) {
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shortUrl)}`;
                break;
            case "instagram":
                shareUrl = `https://www.instagram.com/?url=${encodeURIComponent(shortUrl)}`;
                break;
            case "linkedin":
                shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shortUrl)}`;
                break;
            default:
                break;
        }
        window.open(shareUrl, "_blank");
    };

    return (
        <>
            <div className="flex flex-col w-full space-y-4 p-8 pt-6">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between w-full max-w-6xl">
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <div className="flex items-center space-x-2">
                        <Button className="bg-bank-gradient text-white" onClick={handleReferClick}>
                            <HandHeart />
                            Refer a friend
                        </Button>
                    </div>
                </div>

                {/* Tabs Section */}
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full max-w-6xl space-y-">
                    {/* Tabs List */}
                    <TabsList className="tabs-list">
                        <TabsTrigger
                            value="overview"
                            data-value="overview"
                            className="tabs-trigger"
                        >
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="goals"
                            data-value="goals"
                            className="tabs-trigger"
                        >
                            Goals
                        </TabsTrigger>
                        <TabsTrigger
                            value="notifications"
                            data-value="notifications"
                            className="tabs-trigger"
                        >
                            Notifications
                        </TabsTrigger>
                    </TabsList>

                    {/* Tabs Content */}
                    <TabsContent value="overview" className="tab-content">
                        <DashboardOverview />
                    </TabsContent>
                    <TabsContent value="goals" className="tab-content">
                        <DashboardGoals />
                    </TabsContent>
                    <TabsContent value="notifications" className="tab-content">
                        <DashboardNotifications />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Refer Drawer */}
            <Drawer open={referDrawerOpen} onClose={() => setReferDrawerOpen(false)}>
                <DrawerContent className="bg-white mx-auto w-full max-w-md">
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                            <DrawerTitle>Refer a Friend</DrawerTitle>
                        </DrawerHeader>
                        <div className="p-4">
                            <p className="font-bold">Shortened URL:</p>
                            <a
                                href="#"
                                onClick={() => handleShortUrlClick(shortUrl)}
                            >
                                {shortUrl}
                            </a>
                            <div className="mt-4">
                                <Button className="m-4 w-13 bg-blue-500 rounded-full" onClick={() => shareOnPlatform("facebook")}>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M20 1C21.6569 1 23 2.34315 23 4V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H20ZM20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H15V13.9999H17.0762C17.5066 13.9999 17.8887 13.7245 18.0249 13.3161L18.4679 11.9871C18.6298 11.5014 18.2683 10.9999 17.7564 10.9999H15V8.99992C15 8.49992 15.5 7.99992 16 7.99992H18C18.5523 7.99992 19 7.5522 19 6.99992V6.31393C19 5.99091 18.7937 5.7013 18.4813 5.61887C17.1705 5.27295 16 5.27295 16 5.27295C13.5 5.27295 12 6.99992 12 8.49992V10.9999H10C9.44772 10.9999 9 11.4476 9 11.9999V12.9999C9 13.5522 9.44771 13.9999 10 13.9999H12V21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20Z" fill="#ffffff"></path> </g></svg>
                                </Button>
                                <Button className="m-4 w-13 bg-blue-500 rounded-full" onClick={() => shareOnPlatform("instagram")}>
                                    <svg fill="#ffffff" viewBox="0 0 27 27" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M20.445 5h-8.891A6.559 6.559 0 0 0 5 11.554v8.891A6.559 6.559 0 0 0 11.554 27h8.891a6.56 6.56 0 0 0 6.554-6.555v-8.891A6.557 6.557 0 0 0 20.445 5zm4.342 15.445a4.343 4.343 0 0 1-4.342 4.342h-8.891a4.341 4.341 0 0 1-4.341-4.342v-8.891a4.34 4.34 0 0 1 4.341-4.341h8.891a4.342 4.342 0 0 1 4.341 4.341l.001 8.891z"></path><path d="M16 10.312c-3.138 0-5.688 2.551-5.688 5.688s2.551 5.688 5.688 5.688 5.688-2.551 5.688-5.688-2.55-5.688-5.688-5.688zm0 9.163a3.475 3.475 0 1 1-.001-6.95 3.475 3.475 0 0 1 .001 6.95zM21.7 8.991a1.363 1.363 0 1 1-1.364 1.364c0-.752.51-1.364 1.364-1.364z"></path></g></svg>
                                </Button>
                                <Button className="m-4 w-13 bg-blue-500 rounded-full" onClick={() => shareOnPlatform("linkedin")}>
                                    <svg fill="#ffffff" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="-271 283.9 256 235.1"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <rect x="-264.4" y="359.3" width="49.9" height="159.7"></rect> <path d="M-240.5,283.9c-18.4,0-30.5,11.9-30.5,27.7c0,15.5,11.7,27.7,29.8,27.7h0.4c18.8,0,30.5-12.3,30.4-27.7 C-210.8,295.8-222.1,283.9-240.5,283.9z"></path> <path d="M-78.2,357.8c-28.6,0-46.5,15.6-49.8,26.6v-25.1h-56.1c0.7,13.3,0,159.7,0,159.7h56.1v-86.3c0-4.9-0.2-9.7,1.2-13.1 c3.8-9.6,12.1-19.6,27-19.6c19.5,0,28.3,14.8,28.3,36.4V519h56.6v-88.8C-14.9,380.8-42.7,357.8-78.2,357.8z"></path> </g> </g></svg>
                                </Button>
                            </div>
                        </div>
                        <DrawerFooter>
                            <DrawerClose asChild>
                                <Button variant="outline">Close</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}