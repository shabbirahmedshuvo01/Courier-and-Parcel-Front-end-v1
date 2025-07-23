"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";

interface PrivetRouteProps {
    children: React.ReactNode;
    role: "admin" | "customer" | "courier" | "agent"; // Required role to access this route
}

const PrivetRoute: React.FC<PrivetRouteProps> = ({ children, role }) => {
    const router = useRouter();

    // Redux state
    const user = useSelector((state: RootState) => state.auth?.user);
    const accessToken = useSelector(
        (state: RootState) => state.auth?.access_token
    );

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate auth checking
        const isAuthenticated = !!accessToken && !!user;

        if (!isAuthenticated) {
            // If no token or user, redirect to login
            router.replace("/");
            return;
        }

        const userRole = user?.role as typeof role | undefined;

        // If user role doesn't match required role, redirect to 403 (forbidden)
        if (userRole && userRole !== role) {
            router.replace("/");
            return;
        }

        setLoading(false); // Allow children to render
    }, [accessToken, user, role, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-primary text-lg font-semibold">Authenticating...</p>
            </div>
        );
    }

    return <>{children}</>;
};

export default PrivetRoute;
