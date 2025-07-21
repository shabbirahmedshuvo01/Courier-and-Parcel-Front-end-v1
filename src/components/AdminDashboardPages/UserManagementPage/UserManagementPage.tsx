/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useGetAllUsersQuery } from "@/redux/features/AdminApi/AdminApi"
import { useState } from "react"

interface UserAddress {
    city?: string
    country?: string
}

interface User {
    _id: string
    name: string
    email: string
    phone?: string
    role: string
    isActive: boolean
    createdAt?: string
    address?: UserAddress
}

export default function UserManagementPage() {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [searchName, setSearchName] = useState("")
    const [searchEmail, setSearchEmail] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [sortBy, setSortBy] = useState("createdAt")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
    const [viewMode, setViewMode] = useState<"cards" | "table">("cards")

    // Only backend filtering/sorting
    const { data, isLoading, error } = useGetAllUsersQuery({
        queryData: {
            page,
            limit,
            ...(searchName && { name: searchName }),
            ...(searchEmail && { email: searchEmail }),
            ...(roleFilter !== "all" && { role: roleFilter }),
            ...(statusFilter !== "all" && { isActive: statusFilter === "active" }),
            sort: `${sortOrder === "desc" ? "-" : ""}${sortBy}`,
        },
    })

    const users = data?.data || []
    const totalUsers = data?.count || 0
    const totalPages = Math.max(1, Math.ceil(totalUsers / limit))

    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case "admin":
                return "bg-purple-100 text-purple-800 border-purple-200"
            case "user":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "moderator":
                return "bg-orange-100 text-orange-800 border-orange-200"
            case "manager":
                return "bg-green-100 text-green-800 border-green-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getRoleIcon = (role: string) => {
        switch (role.toLowerCase()) {
            case "admin":
                return "👑"
            case "user":
                return "👤"
            case "moderator":
                return "🛡️"
            case "manager":
                return "👨‍💼"
            default:
                return "👤"
        }
    }

    const getCountryFlag = (country: string) => {
        switch (country?.toLowerCase()) {
            case "usa":
            case "united states":
                return "🇺🇸"
            case "bangladesh":
                return "🇧🇩"
            case "canada":
                return "🇨🇦"
            case "uk":
            case "united kingdom":
                return "🇬🇧"
            case "australia":
                return "🇦🇺"
            case "germany":
                return "🇩🇪"
            case "france":
                return "🇫🇷"
            case "japan":
                return "🇯🇵"
            case "india":
                return "🇮🇳"
            default:
                return "🌍"
        }
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-"
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const exportToCSV = () => {
        const headers = ["Name", "Email", "Phone", "Role", "Status", "City", "Country", "Created Date"]
        const csvData = users.map((user: User) => [
            user.name,
            user.email,
            user.phone || "-",
            user.role,
            user.isActive ? "Active" : "Inactive",
            user.address?.city || "-",
            user.address?.country || "-",
            formatDate(user.createdAt),
        ])
        const csvContent = [headers, ...csvData].map((row) => row.join(",")).join("\n")
        const blob = new Blob([csvContent], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `users-${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl">👥</span>
                        </div>
                    </div>
                    <p className="text-slate-600 text-lg font-medium">Loading users...</p>
                    <p className="text-slate-500 text-sm mt-1">Please wait while we fetch user data</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">❌</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Users</h3>
                    <p className="text-red-600 mb-6">Unable to fetch user data. Please try again later.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    const activeUsers = users.filter((u: User) => u.isActive).length
    const inactiveUsers = users.filter((u: User) => !u.isActive).length
    const adminUsers = users.filter((u: User) => u.role === "admin").length

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
                                User Management
                            </h1>
                            <p className="text-slate-600 text-lg">Manage and monitor all system users</p>
                        </div>
                        <div className="mt-4 lg:mt-0 flex items-center space-x-4">
                            <button
                                onClick={exportToCSV}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                            >
                                <span>📊</span>
                                <span>Export CSV</span>
                            </button>
                            <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm">
                                <button
                                    onClick={() => setViewMode("cards")}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${viewMode === "cards"
                                        ? "bg-purple-600 text-white"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                        }`}
                                >
                                    Cards
                                </button>
                                <button
                                    onClick={() => setViewMode("table")}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${viewMode === "table"
                                        ? "bg-purple-600 text-white"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                        }`}
                                >
                                    Table
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium mb-1">Total Users</p>
                                <p className="text-3xl font-bold">{totalUsers}</p>
                            </div>
                            <div className="bg-white/20 rounded-full p-3">
                                <span className="text-2xl">👥</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-emerald-100 text-sm font-medium mb-1">Active Users</p>
                                <p className="text-3xl font-bold">{activeUsers}</p>
                            </div>
                            <div className="bg-white/20 rounded-full p-3">
                                <span className="text-2xl">✅</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-100 text-sm font-medium mb-1">Inactive Users</p>
                                <p className="text-3xl font-bold">{inactiveUsers}</p>
                            </div>
                            <div className="bg-white/20 rounded-full p-3">
                                <span className="text-2xl">⏸️</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm font-medium mb-1">Admins</p>
                                <p className="text-3xl font-bold">{adminUsers}</p>
                            </div>
                            <div className="bg-white/20 rounded-full p-3">
                                <span className="text-2xl">👑</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Controls */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                        {/* Search Name */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-slate-400 text-lg">👤</span>
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl bg-white/70 backdrop-blur-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                placeholder="Search by name..."
                                value={searchName}
                                onChange={(e) => {
                                    setSearchName(e.target.value)
                                    setPage(1)
                                }}
                            />
                        </div>

                        {/* Search Email */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-slate-400 text-lg">📧</span>
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl bg-white/70 backdrop-blur-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                placeholder="Search by email..."
                                value={searchEmail}
                                onChange={(e) => {
                                    setSearchEmail(e.target.value)
                                    setPage(1)
                                }}
                            />
                        </div>

                        {/* Role Filter */}
                        <div className="relative">
                            <select
                                className="block w-full px-4 py-3 border border-slate-300 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 appearance-none"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                                <option value="moderator">Moderator</option>
                                <option value="manager">Manager</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <select
                                className="block w-full px-4 py-3 border border-slate-300 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 appearance-none"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        {/* Sort By */}
                        <div className="relative">
                            <select
                                className="block w-full px-4 py-3 border border-slate-300 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 appearance-none"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="createdAt">Created Date</option>
                                <option value="name">Name</option>
                                <option value="email">Email</option>
                                <option value="role">Role</option>
                            </select>
                        </div>

                        {/* Sort Order */}
                        <div className="relative">
                            <select
                                className="block w-full px-4 py-3 border border-slate-300 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 appearance-none"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                            >
                                <option value="desc">Newest First</option>
                                <option value="asc">Oldest First</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-slate-600">
                            Showing {users.length} of {totalUsers} users
                        </p>
                        {(searchName || searchEmail || roleFilter !== "all" || statusFilter !== "all") && (
                            <button
                                onClick={() => {
                                    setSearchName("")
                                    setSearchEmail("")
                                    setRoleFilter("all")
                                    setStatusFilter("all")
                                }}
                                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                {users.length > 0 ? (
                    viewMode === "cards" ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {users.map((user: User) => (
                                <div
                                    key={user._id}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-[1.02]"
                                >
                                    {/* Card Header */}
                                    <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-2xl">{getRoleIcon(user.role)}</span>
                                                <div>
                                                    <p className="text-white font-semibold text-lg">{user.name}</p>
                                                    <p className="text-indigo-100 text-sm">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end space-y-1">
                                                <div
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleColor(user.role)}`}
                                                >
                                                    {user.role.toUpperCase()}
                                                </div>
                                                <div
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isActive
                                                        ? "bg-green-100 text-green-800 border border-green-200"
                                                        : "bg-red-100 text-red-800 border border-red-200"
                                                        }`}
                                                >
                                                    {user.isActive ? "ACTIVE" : "INACTIVE"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6 space-y-4">
                                        {/* Contact Info */}
                                        <div className="bg-slate-50/80 rounded-xl p-4">
                                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                <span className="mr-2">📞</span>
                                                Contact Information
                                            </h3>
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-slate-500 text-sm">📧</span>
                                                    <p className="text-sm text-gray-900">{user.email}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-slate-500 text-sm">📱</span>
                                                    <p className="text-sm text-gray-900">{user.phone || "Not provided"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Location */}
                                        {(user.address?.city || user.address?.country) && (
                                            <div className="bg-slate-50/80 rounded-xl p-4">
                                                <h4 className="font-medium text-gray-900 mb-2 flex items-center text-sm">
                                                    <span className="mr-2">📍</span>
                                                    Location
                                                </h4>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-lg">{getCountryFlag(user.address?.country || "")}</span>
                                                    <div className="text-sm text-slate-700">
                                                        <p>
                                                            {user.address?.city && user.address?.country
                                                                ? `${user.address.city}, ${user.address.country}`
                                                                : user.address?.city || user.address?.country || "Not specified"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Account Details */}
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                                            <h4 className="font-medium text-gray-900 mb-3 flex items-center text-sm">
                                                <span className="mr-2">⚙️</span>
                                                Account Details
                                            </h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-slate-600">User ID:</span>
                                                    <code className="text-xs bg-white px-2 py-1 rounded font-mono text-slate-800">
                                                        {user._id.slice(-8)}
                                                    </code>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-slate-600">Member since:</span>
                                                    <span className="text-xs text-slate-800 font-medium">{formatDate(user.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Table View */
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">User</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Contact</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Role</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Location</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Created</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user: User, index: number) => (
                                            <tr
                                                key={user._id}
                                                className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                                                    }`}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-2xl">{getRoleIcon(user.role)}</span>
                                                        <div>
                                                            <p className="font-medium text-slate-800">{user.name}</p>
                                                            <p className="text-sm text-slate-500">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm">
                                                        <p className="text-slate-700">{user.email}</p>
                                                        <p className="text-slate-500">{user.phone || "No phone"}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div
                                                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getRoleColor(user.role)}`}
                                                    >
                                                        {user.role.toUpperCase()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div
                                                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${user.isActive
                                                            ? "bg-green-100 text-green-800 border border-green-200"
                                                            : "bg-red-100 text-red-800 border border-red-200"
                                                            }`}
                                                    >
                                                        {user.isActive ? "ACTIVE" : "INACTIVE"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-lg">{getCountryFlag(user.address?.country || "")}</span>
                                                        <div className="text-sm text-slate-700">
                                                            <p>{user.address?.city || "-"}</p>
                                                            <p className="text-slate-500 capitalize">{user.address?.country || "-"}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-700">{formatDate(user.createdAt)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">👥</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">No users found</h3>
                        <p className="text-slate-600 mb-6">
                            {searchName || searchEmail || roleFilter !== "all" || statusFilter !== "all"
                                ? "Try adjusting your search criteria or filters."
                                : "No users have been registered yet."}
                        </p>
                        {(searchName || searchEmail || roleFilter !== "all" || statusFilter !== "all") && (
                            <button
                                onClick={() => {
                                    setSearchName("")
                                    setSearchEmail("")
                                    setRoleFilter("all")
                                    setStatusFilter("all")
                                }}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}

                {/* Pagination */}
                <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <p className="text-sm text-slate-700">
                                Showing <span className="font-medium">{users.length}</span> of{" "}
                                <span className="font-medium">{totalUsers}</span> users
                            </p>
                            <div className="flex items-center space-x-2">
                                <label className="text-sm text-slate-600">Per page:</label>
                                <select
                                    className="border border-slate-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    value={limit}
                                    onChange={(e) => setLimit(Number(e.target.value))}
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${page === 1
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                                    }`}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </button>

                            <div className="flex items-center space-x-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const pageNum = i + 1
                                    return (
                                        <button
                                            key={pageNum}
                                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${page === pageNum
                                                ? "bg-purple-600 text-white"
                                                : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                                                }`}
                                            onClick={() => setPage(pageNum)}
                                        >
                                            {pageNum}
                                        </button>
                                    )
                                })}
                            </div>

                            <button
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${page >= totalPages
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                                    }`}
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}