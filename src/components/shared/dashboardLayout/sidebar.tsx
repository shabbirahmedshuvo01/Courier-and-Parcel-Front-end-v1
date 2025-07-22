/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LogOut, MailCheck, Menu } from "lucide-react";

import { Home } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
// import Image from "next/image";
import { logoutHandler } from "@/utils/handleLogout";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
// import { MdOutlineHandshake } from "react-icons/md";
// import { FcCdLogo } from "react-icons/fc";
import { LuCalendarCheck2 } from "react-icons/lu";
import { LuSchool } from "react-icons/lu";
// import { MdAttachMoney } from "react-icons/md";
import { CiWallet } from "react-icons/ci";
import { FaUserEdit } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { GiBuyCard } from "react-icons/gi";
import { RiShieldUserFill } from "react-icons/ri";
import Image from "next/image";
import navLogo from "@/assets/images/logo.png";
import { TbArrowsRandom } from "react-icons/tb";
import { IoBookmark } from "react-icons/io5";

export default function Sidebar({ role = "user" }: { role?: string }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Function to check if a menu item is active
    const isActive = (href: string) => pathname === href;

    function NavItem({
        href = "#",
        icon: Icon,
        children,
    }: {
        href?: string;
        icon?: React.ComponentType<any>;
        children: React.ReactNode;
    }) {
        return (
            <Link
                href={href}
                className={`flex items-center px-3 py-2 text-sm md:text-base rounded-md transition-colors 
        ${isActive(href) ? "text-white bg-green-600" : "text-gray-600"} 
        hover:text-gray-900 hover:bg-gray-400`}
            >
                {Icon && <Icon className="h-5 w-5 mr-3 flex-shrink-0" />}
                {children}
            </Link>
        );
    }

    const router = useRouter();
    const dispatch = useDispatch();
    const handleLogout = () => {
        logoutHandler(dispatch, router);
        window.dispatchEvent(new Event("logout"));
    };

    return (
        <>
            <button
                type="button"
                className="xl:hidden fixed top-4 left-4 z-[70] p-1 rounded-lg bg-white border-2 border-gray-300"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                <Menu className="h-6 w-6 text-gray-600" />
            </button>
            <nav
                className={`fixed inset-y-0 left-0 z-[70] w-64 bg-white transform transition-transform duration-200 ease-in-out
                xl:translate-x-0 xl:static xl:w-64 border-r border-gray-200
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="h-full flex flex-col">
                    <Link
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-16 px-6 flex items-center border-b border-gray-200"
                    >
                        <div className="flex items-center gap-3">
                            {/* <svg
                width={32}
                height={32}
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <mask
                  id="mask0_292_1464"
                  style={{ maskType: "luminance" }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="40"
                  height="40"
                >
                  <path d="M40 0H0V40H40V0Z" fill="white" />
                </mask>
                <g mask="url(#mask0_292_1464)">
                  <path
                    d="M40 20C40 31.0457 31.0457 40 20 40C8.95427 40 0 31.0457 0 20C0 8.95427 8.95427 0 20 0C31.0457 0 40 8.95427 40 20ZM2.8 20C2.8 29.4993 10.5007 37.2 20 37.2C29.4993 37.2 37.2 29.4993 37.2 20C37.2 10.5007 29.4993 2.8 20 2.8C10.5007 2.8 2.8 10.5007 2.8 20Z"
                    fill="#FFBE0B"
                  />
                  <path
                    d="M13.7126 14.533L27.5845 11.0342L26.284 25.4665L12.4121 28.9652L13.7126 14.533Z"
                    stroke="#FFBE0B"
                    strokeWidth="2"
                  />
                </g>
              </svg> */}
                            <Image
                                src={navLogo}
                                alt="Logo"
                                width={navLogo.width}
                                height={navLogo.height}
                                className="w-auto h-6 md:h-7"
                                priority
                            />

                            <p className="text-lg font-bold text-gray-700">Trust and Build</p>
                        </div>
                    </Link>

                    <div className="flex-1 overflow-y-auto py-4 px-4">
                        <div className="space-y-6">
                            <div>
                                {role === "admin" && (
                                    <div className="space-y-1">
                                        <NavItem href="/admin-dashboard" icon={Home}>
                                            Quick View
                                        </NavItem>
                                        <NavItem href="/admin-dashboard/manage-parcels" icon={LuSchool}>
                                            Manage Parcel
                                        </NavItem>
                                        <NavItem
                                            href="/admin-dashboard/user-management"
                                            icon={RiShieldUserFill}
                                        >
                                            User Management
                                        </NavItem>
                                        <NavItem href="/dashboard/booked-users" icon={IoBookmark}>
                                            Booked Users
                                        </NavItem>
                                        <NavItem
                                            href="/dashboard/subscription"
                                            icon={TbArrowsRandom}
                                        >
                                            Subscription
                                        </NavItem>
                                        <NavItem href="/dashboard/subscribers" icon={MailCheck}>
                                            Subscribers
                                        </NavItem>
                                        <NavItem href="/dashboard/wallet" icon={CiWallet}>
                                            Wallet
                                        </NavItem>
                                        <NavItem
                                            href="/dashboard/subscription-purchase"
                                            icon={GiBuyCard}
                                        >
                                            Purchase
                                        </NavItem>
                                        <NavItem href="/dashboard/my-profile" icon={FaUserEdit}>
                                            My Profile
                                        </NavItem>
                                    </div>
                                )}

                                {role === "user" && (
                                    <div className="space-y-1">
                                        <NavItem href="/" icon={RxDashboard}>
                                            Overview
                                        </NavItem>
                                        <NavItem
                                            href="/my-parcel"
                                            icon={LuCalendarCheck2}
                                        >
                                            My Parcel
                                        </NavItem>
                                        <NavItem href="/my-parcels-all" icon={LuSchool}>
                                            All Parcel
                                        </NavItem>
                                        <NavItem
                                            href="/create-parcel"
                                            icon={TbArrowsRandom}
                                        >
                                            Create Parcel
                                        </NavItem>
                                        <NavItem
                                            href="/user-profile"
                                            icon={FaUserEdit}
                                        >
                                            My Profile
                                        </NavItem>
                                    </div>
                                )}
                                {role === "org" && (
                                    <div className="space-y-1">
                                        <NavItem href="/org-dashboard" icon={RxDashboard}>
                                            Dashboard
                                        </NavItem>
                                        <NavItem
                                            href="/org-dashboard/my-events"
                                            icon={LuCalendarCheck2}
                                        >
                                            My Events
                                        </NavItem>
                                        <NavItem href="/org-dashboard/my-classes" icon={LuSchool}>
                                            My Classes
                                        </NavItem>
                                        <NavItem
                                            href="/org-dashboard/booked-users"
                                            icon={IoBookmark}
                                        >
                                            Booked Users
                                        </NavItem>
                                        <NavItem
                                            href="/org-dashboard/payment-billing"
                                            icon={TbArrowsRandom}
                                        >
                                            Payment & billing
                                        </NavItem>
                                        <NavItem href="/org-dashboard/my-profile" icon={FaUserEdit}>
                                            My Profile
                                        </NavItem>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="px-4 py-4 border-t border-gray-200">
                        <div className="space-y-1">
                            <NavItem>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center"
                                >
                                    <LogOut size={35} className="h-5 w-5 mr-3" />
                                    <span className="text-sm md:text-base text-gray-600">
                                        Logout
                                    </span>
                                </button>
                            </NavItem>
                        </div>
                    </div>
                </div>
            </nav>

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-[65] lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
}