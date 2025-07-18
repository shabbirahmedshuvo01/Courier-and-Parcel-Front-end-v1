import { logoutHandler } from "@/utils/handleLogout";
import { LogOut, MoveUpRight, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import UserImage from "@/assets/images/Human.png";
import { MdDashboard } from "react-icons/md";

interface MenuItem {
    label: string;
    value?: string;
    href: string;
    icon?: React.ReactNode;
    external?: boolean;
}

interface Profile01Props {
    name: string;
    role: string;
    avatar: string;
    subscription?: string;
    onLinkClick: () => void;
}

const defaultProfile = {
    name: "Name",
    role: "Admin Founder",
    avatar: UserImage?.src,
    subscription: "Free Trial",
    onLinkClick: () => { },
} satisfies Required<Profile01Props>;

export default function Profile01({
    name = defaultProfile.name,
    role = defaultProfile.role,
    avatar = defaultProfile.avatar,
    onLinkClick,
}: Partial<Profile01Props> = defaultProfile) {
    const menuItems: MenuItem[] = [
        {
            label: "Dashboard",
            href:
                role === "ORGANIZER"
                    ? "/org-dashboard"
                    : role === "ADMIN"
                        ? "/user-dashboard"
                        : "/user-dashboard",
            icon: <MdDashboard className="w-4 h-4" />,
        },
        {
            label: "My Profile",
            href:
                role === "ORGANIZER"
                    ? "/org-dashboard/my-profile"
                    : role === "ADMIN"
                        ? "/user-dashboard/my-profile"
                        : "/user-dashboard/my-profile",
            icon: <UserRound className="w-4 h-4" />,
        },
    ];

    const router = useRouter();
    const dispatch = useDispatch();
    const handleLogout = () => {
        logoutHandler(dispatch, router);
    };

    // const {
    //     data: creditData,
    //     isLoading,
    //     isFetching,
    // } = useGetCreditsQuery(undefined);

    // const data = creditData?.data;

    // const percentage =
    //     data?.totalCredit > 0
    //         ? Math.ceil((data?.remaining / data?.totalCredit) * 100)
    //         : 0;

    return (
        <div className="relative w-full max-w-sm mx-auto z-[100000]">
            <div className="relative overflow-hidden rounded-lg border border-zinc-200  ">
                <div className="relative p-4 z-[999999]">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative shrink-0">
                            <Image
                                src={avatar}
                                alt={name}
                                width={48}
                                height={48}
                                className="rounded-full ring-4 ring-white  object-cover"
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white " />
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-zinc-900 ">{name}</h2>
                            {/* {role === "PARTICIPANT" ? (
                                isLoading || isFetching ? (
                                    <div className="text-zinc-600 mt-[2px]">
                                        <div className="flex justify-between gap-4">
                                            <div className="w-12 h-3 bg-gray-300 animate-pulse rounded"></div>
                                            <div className="w-12 h-3 bg-gray-300 animate-pulse rounded"></div>
                                        </div>
                                        {role === "PARTICIPANT" ? (
                                            <div className="w-full h-2 rounded-2xl bg-gray-300 animate-pulse mt-1"></div>
                                        ) : (
                                            <div className="w-16 h-4 bg-gray-300 animate-pulse rounded mt-2"></div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-zinc-600 mt-[2px">
                                        <div className="flex justify-between gap-4">
                                            <div className="text-xs font-medium">
                                                {data?.remaining}
                                            </div>
                                            <div className="text-xs font-medium">
                                                {data?.totalCredit}
                                            </div>
                                        </div>
                                        <div className="w-full h-2 rounded-2xl bg-zinc-200 relative">
                                            <div
                                                className="h-2 rounded-2xl bg-gradient-to-l from-primary via-yellow-400 to-primary absolute top-0 left-0 "
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            ) : (
                                role
                            )} */}
                            <div className="text-zinc-600 mt-[2px">
                                <div className="flex justify-between gap-4">
                                    <div className="text-xs font-medium">
                                        Hello
                                    </div>
                                    <div className="text-xs font-medium">
                                        text
                                    </div>
                                </div>
                                <div className="w-full h-2 rounded-2xl bg-zinc-200 relative">
                                    <div
                                        className="h-2 rounded-2xl bg-gradient-to-l from-primary via-yellow-400 to-primary absolute top-0 left-0 "
                                        style={{ width: `${10}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="h-px bg-zinc-200  my-3" />
                    <div className="space-y-1">
                        {menuItems?.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => {
                                    onLinkClick?.();
                                }}
                                className="flex items-center justify-between p-2 
                                    hover:bg-zinc-50 -800/50 
                                    rounded-lg transition-colors duration-200"
                            >
                                <div className="flex items-center gap-2">
                                    {item.icon}
                                    <span className="text-sm lg:text-base font-medium text-zinc-700 ">
                                        {item.label}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    {item.value && (
                                        <span className="text-sm text-zinc-500  mr-2">
                                            {item.value}
                                        </span>
                                    )}
                                    {item.external && <MoveUpRight className="w-4 h-4" />}
                                </div>
                            </Link>
                        ))}

                        <button
                            type="button"
                            className="w-full flex items-center justify-between p-2 
                                hover:bg-zinc-50
                                rounded-lg transition-colors duration-200"
                        >
                            <div className="flex items-center gap-2" onClick={handleLogout}>
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm lg:text-base font-medium text-zinc-700 ">
                                    Logout
                                </span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}