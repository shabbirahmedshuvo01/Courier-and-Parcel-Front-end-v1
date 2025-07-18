"use client";
import React, { useState, useEffect, useRef } from "react";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import UserImage from "@/assets/images/Human.png";
import Profile01 from "./profile-01";

interface DropdownMenuProps {
    children: React.ReactNode;
}

interface DropdownMenuContentProps extends DropdownMenuProps {
    align?: string;
    sideOffset?: number;
    className?: string;
}

interface DropdownMenuTriggerProps {
    children: React.ReactNode;
    className?: string;
}

export const DropdownMenuTrigger = ({
    children,
    className,
}: DropdownMenuTriggerProps) => {
    return <div className={className}>{children}</div>;
};

export const DropdownMenuContent = ({
    children,
    align = "start",
    sideOffset = 0,
    className = "",
}: DropdownMenuContentProps) => {
    return (
        <div
            className={`absolute z-[10000] ${align === "end" ? "right-0" : "left-0"
                } ${className}`}
            style={{
                marginTop: sideOffset,
                top: "100%", // Position the dropdown below the trigger
            }}
        >
            <div className="relative p-2 bg-white border border-zinc-200 rounded-lg shadow-lg">
                {children}
            </div>
        </div>
    );
};

export const DropdownMenu = ({ children }: DropdownMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null); // ✅ Reference for outside click

    const user = useSelector((state: RootState) => state.auth.user);

    // ✅ Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div onClick={() => setIsOpen((prev) => !prev)}>{children}</div>
            {isOpen && (
                <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-[280px] sm:w-80"
                >
                    <Profile01
                        onLinkClick={() => setIsOpen(false)}
                        name={(() => {
                            const firstName = user?.firstName || "";
                            const lastName = user?.lastName || "";
                            const fullName = `${firstName} ${lastName}`.trim();
                            return fullName.length > 20
                                ? fullName.slice(0, 20) + "..."
                                : fullName;
                        })()}
                        avatar={user?.profileImage || UserImage?.src}
                        role={user?.role || ""}
                    />
                </DropdownMenuContent>
            )}
        </div>
    );
};