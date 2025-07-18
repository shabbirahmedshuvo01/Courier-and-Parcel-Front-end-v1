"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
// import NotificationDetails from "./NotificationDetails";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import UserImage from "@/assets/images/Human.png";
import { DropdownMenu, DropdownMenuTrigger } from "./dropdown-menu";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

export default function TopNav() {
    const pathname = usePathname();

    const breadcrumbs: BreadcrumbItem[] = pathname
        .split("/")
        .map((segment, index) => {
            const label = segment
                .replace(/-/g, " ")
                .replace(/^\w/, (c) => c.toUpperCase());
            const href =
                index === 0
                    ? "/"
                    : `/${pathname
                        .split("/")
                        .slice(1, index + 1)
                        .join("/")}`;
            return { label, href: href === "/" ? undefined : href };
        })
        .filter(
            (item) =>
                item.label &&
                item.label !== "org-dashboard" &&
                item.label !== "dashboard"
        )
        .map((item, index) => {
            if (index === 0 && item.label === "org") {
                return { ...item, label: "Organization" };
            }
            return item;
        });

    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <nav className="px-3 sm:px-6 flex items-center justify-between bg-white   h-full">
            <div className="font-medium text-sm hidden xl:flex items-center space-x-1 truncate max-w-[300px]">
                {breadcrumbs?.map((item, index) => (
                    <div key={item.label} className="flex items-center">
                        {index > 0 && (
                            <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-500 mx-1" />
                        )}
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="text-gray-700 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-400 transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-gray-900 dark:text-gray-100">
                                {item.label}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 ml-auto xl:ml-0">
                {/* <NotificationDetails /> */}

                <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                        <div>
                            <div className="flex relative items-center gap-2">
                                <Image
                                    src={user?.profileImage || UserImage}
                                    alt="User avatar"
                                    width={28}
                                    height={28}
                                    className="rounded-full ring-2 ring-gray-200 dark:ring-textPrimary sm:w-9 sm:h-9 cursor-pointer"
                                />
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white " />
                            </div>
                        </div>
                    </DropdownMenuTrigger>
                </DropdownMenu>
            </div>
        </nav>
    );
}