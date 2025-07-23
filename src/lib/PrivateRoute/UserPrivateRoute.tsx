"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { usePathname, useRouter } from "next/navigation";

interface Props {
    children: React.ReactNode;
}

const UserPrivateRoute: React.FC<Props> = ({ children }) => {

    // const root = 

    const router = useRouter();
    const pathname = usePathname()

    // console.log("pathname", pathname);


    const user = useSelector((state: RootState) => state.auth.user);

    // console.log(user?.role, "user role in private route");
    // Adjust this selector based on your authSlice structure
    const isAuthenticated = useSelector((state: RootState) => state.auth?.access_token && state.auth?.user);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("auth/login");
        } else if (user?.role !== "admin") {
            // If the user is authenticated but not an admin, redirect to a different page
            router.push("/");
        } else if (user?.role === "admin" && pathname !== "/admin-dashboard") {
            // If the user is an admin, ensure they are on the admin dashboard
            router.push("/admin-dashboard");
        }
    }, [isAuthenticated, router, user?.role, pathname]);

    // Optionally, you can show a loading spinner while checking auth
    if (!isAuthenticated) return null;

    return <>{children}</>;
};

export default UserPrivateRoute;