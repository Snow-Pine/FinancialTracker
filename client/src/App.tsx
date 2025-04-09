import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import DashboardPage from "./pages/dashboard-page";
import URLPage from "./pages/dashboard-url";
import TransactionsPage from "./pages/TransactionsPage";
import HeaderBox from "./blocks/HeaderBox";
import Sidebar from "./blocks/Sidebar";
import MobileNav from "./blocks/MobileNav";
import Landing from "@/pages/landing";
import ProfilePage from "@/pages/profile";
import RedirectPage from "@/pages/RedirectPage";
import { PageLoader } from "./components/ui/page-loader";

import "@/styles/globals.css";

const App = () => {
  const { isAuthenticated, loading } = useAuth(); // Use the `useAuth` hook for authentication
  const [user, setUser] = useState('');

  const fetchUser = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/profile`, {
        credentials: "include",
      });
      const data = await response.json();
      if (data.name.includes("@")) {
        setUser(data.nickname);
      } else {
        setUser(data.name);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated");
      // Perform any authenticated user-related data fetching here
      fetchUser();

    }
  }, [isAuthenticated]);

  if (loading) {
    // Show a loading state while checking authentication
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated users to the Landing page
    return <Landing />;
  }

  return (
    <Router>
      <main className="flex h-screen w-full">
        {/* WEB SIDEBAR */}
        <Sidebar />

        {/* MOBILE SIDEBAR */}
        <div className="flex size-full flex-col">
          <div className="root-layout">
            <img
              src="/icons/logo.svg"
              width={30}
              height={30}
              alt="Menu icon"
            />
            <MobileNav />
          </div>
          <section className="home">
            <div className="home-content">
              <header className="home-header">
                <HeaderBox
                  type="greeting"
                  title="Welcome"
                  user={user}
                  subtext="Access and manage your transactions efficiently."
                />
              </header>

              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/saved-links" element={<URLPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/url/:shortId" element={<RedirectPage />} />
              </Routes>
            </div>
          </section>
        </div>
      </main>
    </Router>
  );
};

export default App;