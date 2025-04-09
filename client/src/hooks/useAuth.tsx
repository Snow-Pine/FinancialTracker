import { useEffect, useState } from "react";

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/getAuth`, {
                credentials: 'include',
            });
            const data = await response.json();
            setIsAuthenticated(data.isAuthenticated);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };



    useEffect(() => {
        checkAuth();
    }, []);

    return { isAuthenticated, loading };
}