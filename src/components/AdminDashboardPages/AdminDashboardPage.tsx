/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import LoadingPage from "@/app/loading"
import { useGetAllParcelsQuery } from "@/redux/features/AdminApi/AdminApi"

interface Parcel {
    _id: string
    recipient: {
        name: string
        email: string
        phone: string
        address: {
            street: string
            city: string
            state: string
            zipCode: string
            country: string
        }
    }
    parcelDetails: {
        dimensions: {
            length: number
            width: number
            height: number
        }
        weight: number
        description: string
        value: number
        category: string
    }
    shipping: {
        service: string
        cost: number
        estimatedDelivery: string
    }
    sender: string
    status: string
    paymentStatus: string
    trackingNumber: string
    statusHistory: any[]
    createdAt: string
    updatedAt: string
    __v: number
}

export default function AdminDashboardPage() {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [sortBy, setSortBy] = useState("createdAt")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
    const [viewMode, setViewMode] = useState<"cards" | "table">("cards")

    const { data, error, isLoading } = useGetAllParcelsQuery({
        queryData: {
            page,
            limit,
            ...(search && { search }),
            ...(statusFilter !== "all" && { status: statusFilter }),
            ...(categoryFilter !== "all" && { "parcelDetails.category": categoryFilter }),
            sort: `${sortOrder === "desc" ? "-" : ""}${sortBy}`,
        },
    })

    const myParcels = data?.data || []



    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "delivered":
                return "bg-emerald-100 text-emerald-800 border-emerald-200"
            case "in-transit":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "pending":
                return "bg-amber-100 text-amber-800 border-amber-200"
            case "cancelled":
                return "bg-red-100 text-red-800 border-red-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getPaymentStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "paid":
                return "bg-green-100 text-green-800 border-green-200"
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "failed":
                return "bg-red-100 text-red-800 border-red-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case "electronics":
                return "📱"
            case "clothing":
                return "👕"
            case "books":
                return "📚"
            case "food":
                return "🍕"
            case "furniture":
                return "🪑"
            case "toys":
                return "🧸"
            default:
                return "📦"
        }
    }

    const getServiceIcon = (service: string) => {
        switch (service.toLowerCase()) {
            case "express":
                return "⚡"
            case "overnight":
                return "🌙"
            case "standard":
                return "📦"
            case "economy":
                return "🐌"
            default:
                return "🚚"
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    //   const formatDateTime = (dateString: string) => {
    //     return new Date(dateString).toLocaleDateString("en-US", {
    //       year: "numeric",
    //       month: "short",
    //       day: "numeric",
    //       hour: "2-digit",
    //       minute: "2-digit",
    //     })
    //   }

    const isDeliveryUrgent = (estimatedDelivery: string) => {
        const deliveryDate = new Date(estimatedDelivery)
        const now = new Date()
        const diffHours = (deliveryDate.getTime() - now.getTime()) / (1000 * 60 * 60)
        return diffHours <= 24 && diffHours > 0
    }

    const exportToCSV = () => {
        const headers = [
            "Tracking Number",
            "Recipient",
            "Email",
            "Phone",
            "Address",
            "Category",
            "Weight",
            "Value",
            "Shipping Service",
            "Shipping Cost",
            "Status",
            "Payment Status",
            "Created",
            "Estimated Delivery",
        ]

        const csvData = myParcels?.map((parcel: Parcel) => [
            parcel.trackingNumber,
            parcel.recipient.name,
            parcel.recipient.email,
            parcel.recipient.phone,
            `${parcel.recipient.address.street}, ${parcel.recipient.address.city}, ${parcel.recipient.address.state}, ${parcel.recipient.address.zipCode}, ${parcel.recipient.address.country}`,
            parcel.parcelDetails.category,
            parcel.parcelDetails.weight,
            parcel.parcelDetails.value,
            parcel.shipping.service,
            parcel.shipping.cost,
            parcel.status,
            parcel.paymentStatus,
            formatDate(parcel.createdAt),
            formatDate(parcel.shipping.estimatedDelivery),
        ])

        const csvContent = [headers, ...csvData].map((row) => row.join(",")).join("\n")
        const blob = new Blob([csvContent], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `parcels-${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
    }

    if (isLoading) return <LoadingPage />

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">❌</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Parcels</h3>
                    <p className="text-red-600 mb-6">Unable to fetch your parcel data. Please try again later.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    const totalParcels = myParcels.length
    const deliveredCount = myParcels.filter((p: Parcel) => p.status === "delivered").length
    const pendingCount = myParcels.filter((p: Parcel) => p.status === "pending").length
    const inTransitCount = myParcels.filter((p: Parcel) => p.status === "in-transit").length
    const totalValue = myParcels.reduce((sum: number, p: Parcel) => sum + p.parcelDetails.value, 0)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                                Parcel Dashboard
                            </h1>
                            <p className="text-slate-600 text-lg">Manage and track all your shipments</p>
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
                                        ? "bg-indigo-600 text-white"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                        }`}
                                >
                                    Cards
                                </button>
                                <button
                                    onClick={() => setViewMode("table")}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${viewMode === "table"
                                        ? "bg-indigo-600 text-white"
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium mb-1">Total Parcels</p>
                                <p className="text-3xl font-bold">{totalParcels}</p>
                            </div>
                            <div className="bg-white/20 rounded-full p-3">
                                <span className="text-2xl">📦</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-emerald-100 text-sm font-medium mb-1">Delivered</p>
                                <p className="text-3xl font-bold">{deliveredCount}</p>
                            </div>
                            <div className="bg-white/20 rounded-full p-3">
                                <span className="text-2xl">✅</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-amber-100 text-sm font-medium mb-1">Pending</p>
                                <p className="text-3xl font-bold">{pendingCount}</p>
                            </div>
                            <div className="bg-white/20 rounded-full p-3">
                                <span className="text-2xl">⏳</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm font-medium mb-1">In Transit</p>
                                <p className="text-3xl font-bold">{inTransitCount}</p>
                            </div>
                            <div className="bg-white/20 rounded-full p-3">
                                <span className="text-2xl">🚚</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-pink-100 text-sm font-medium mb-1">Total Value</p>
                                <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
                            </div>
                            <div className="bg-white/20 rounded-full p-3">
                                <span className="text-2xl">💰</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Controls */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                        {/* Search */}
                        <div className="relative lg:col-span-2">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-slate-400 text-lg">🔍</span>
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl bg-white/70 backdrop-blur-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                placeholder="Search parcels..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <select
                                className="block w-full px-4 py-3 border border-slate-300 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="in-transit">In Transit</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <select
                                className="block w-full px-4 py-3 border border-slate-300 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="all">All Categories</option>
                                <option value="electronics">Electronics</option>
                                <option value="clothing">Clothing</option>
                                <option value="books">Books</option>
                                <option value="food">Food</option>
                                <option value="furniture">Furniture</option>
                                <option value="toys">Toys</option>
                            </select>
                        </div>

                        {/* Sort By */}
                        <div className="relative">
                            <select
                                className="block w-full px-4 py-3 border border-slate-300 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="createdAt">Created Date</option>
                                <option value="estimatedDelivery">Delivery Date</option>
                                <option value="value">Value</option>
                                <option value="weight">Weight</option>
                                <option value="cost">Shipping Cost</option>
                                <option value="name">Recipient Name</option>
                            </select>
                        </div>

                        {/* Sort Order */}
                        <div className="relative">
                            <select
                                className="block w-full px-4 py-3 border border-slate-300 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none"
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
                            Showing {myParcels?.length} of {totalParcels} parcels
                        </p>
                        {(search || statusFilter !== "all" || categoryFilter !== "all") && (
                            <button
                                onClick={() => {
                                    setSearch("")
                                    setStatusFilter("all")
                                    setCategoryFilter("all")
                                }}
                                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                {myParcels?.length > 0 ? (
                    viewMode === "cards" ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {myParcels?.map((parcel: Parcel) => (
                                <div
                                    key={parcel._id}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-[1.02]"
                                >
                                    {/* Card Header */}
                                    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-2xl">{getCategoryIcon(parcel.parcelDetails.category)}</span>
                                                <div>
                                                    <p className="text-white font-semibold text-sm">Tracking Number</p>
                                                    <p className="text-indigo-100 font-mono text-xs">{parcel.trackingNumber}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end space-y-1">
                                                <div
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(parcel.status)}`}
                                                >
                                                    {parcel.status.toUpperCase()}
                                                </div>
                                                {parcel.paymentStatus && (
                                                    <div
                                                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(parcel.paymentStatus)}`}
                                                    >
                                                        {parcel.paymentStatus}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6 space-y-5">
                                        {/* Recipient Info */}
                                        <div className="bg-slate-50/80 rounded-xl p-4">
                                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                <span className="mr-2">👤</span>
                                                Recipient Details
                                            </h3>
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-gray-900">{parcel.recipient.name}</p>
                                                <p className="text-xs text-slate-600">{parcel.recipient.email}</p>
                                                <p className="text-xs text-slate-600">{parcel.recipient.phone}</p>
                                            </div>
                                        </div>

                                        {/* Address */}
                                        <div className="bg-slate-50/80 rounded-xl p-4">
                                            <h4 className="font-medium text-gray-900 mb-2 flex items-center text-sm">
                                                <span className="mr-2">📍</span>
                                                Delivery Address
                                            </h4>
                                            <div className="text-xs text-slate-700 space-y-1">
                                                <p>{parcel.recipient.address.street}</p>
                                                <p>
                                                    {parcel.recipient.address.city}, {parcel.recipient.address.state}{" "}
                                                    {parcel.recipient.address.zipCode}
                                                </p>
                                                <p className="capitalize font-medium">{parcel.recipient.address.country}</p>
                                            </div>
                                        </div>

                                        {/* Shipping Info */}
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                                            <h4 className="font-medium text-gray-900 mb-3 flex items-center text-sm">
                                                <span className="mr-2">{getServiceIcon(parcel.shipping.service)}</span>
                                                Shipping Details
                                            </h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <p className="text-xs text-slate-600 mb-1">Service</p>
                                                    <p className="font-semibold text-sm text-gray-900 capitalize">{parcel.shipping.service}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-600 mb-1">Cost</p>
                                                    <p className="font-semibold text-sm text-gray-900">{formatCurrency(parcel.shipping.cost)}</p>
                                                </div>
                                            </div>
                                            <div className="mt-3">
                                                <p className="text-xs text-slate-600 mb-1">Estimated Delivery</p>
                                                <div className="flex items-center space-x-2">
                                                    <p className="font-semibold text-sm text-gray-900">
                                                        {formatDate(parcel.shipping.estimatedDelivery)}
                                                    </p>
                                                    {isDeliveryUrgent(parcel.shipping.estimatedDelivery) && (
                                                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                                                            Urgent
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Parcel Details */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-slate-50/80 rounded-xl p-3">
                                                <p className="text-xs text-slate-600 mb-1">Weight</p>
                                                <p className="font-semibold text-sm text-gray-900">{parcel.parcelDetails.weight} kg</p>
                                            </div>
                                            <div className="bg-slate-50/80 rounded-xl p-3">
                                                <p className="text-xs text-slate-600 mb-1">Value</p>
                                                <p className="font-semibold text-sm text-gray-900">
                                                    {formatCurrency(parcel.parcelDetails.value)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50/80 rounded-xl p-3">
                                            <p className="text-xs text-slate-600 mb-1">Dimensions (L×W×H)</p>
                                            <p className="font-semibold text-sm text-gray-900">
                                                {parcel.parcelDetails.dimensions.length}×{parcel.parcelDetails.dimensions.width}×
                                                {parcel.parcelDetails.dimensions.height} cm
                                            </p>
                                        </div>

                                        {/* Description */}
                                        <div className="bg-slate-50/80 rounded-xl p-3">
                                            <p className="text-xs text-slate-600 mb-1">Description</p>
                                            <p className="text-sm text-gray-900">{parcel.parcelDetails.description}</p>
                                        </div>

                                        {/* Dates */}
                                        <div className="flex justify-between text-xs text-slate-500 pt-3 border-t border-slate-200">
                                            <div>
                                                <span className="font-medium">Created:</span> {formatDate(parcel.createdAt)}
                                            </div>
                                            <div>
                                                <span className="font-medium">Updated:</span> {formatDate(parcel.updatedAt)}
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
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Tracking #</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Recipient</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Address</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Category</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Weight</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Value</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Shipping</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Est. Delivery</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myParcels?.map((parcel: Parcel, index: number) => (
                                            <tr
                                                key={parcel._id}
                                                className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                                                    }`}
                                            >
                                                <td className="px-6 py-4">
                                                    <code className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-slate-800">
                                                        {parcel.trackingNumber}
                                                    </code>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-medium text-slate-800">{parcel.recipient.name}</p>
                                                        <p className="text-sm text-slate-500">{parcel.recipient.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-700 max-w-xs">
                                                    <div className="truncate">
                                                        {parcel.recipient.address.street}, {parcel.recipient.address.city},{" "}
                                                        {parcel.recipient.address.state}, {parcel.recipient.address.zipCode},{" "}
                                                        {parcel.recipient.address.country}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <span>{getCategoryIcon(parcel.parcelDetails.category)}</span>
                                                        <span className="text-sm text-slate-700 capitalize">{parcel.parcelDetails.category}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-700">{parcel.parcelDetails.weight} kg</td>
                                                <td className="px-6 py-4 text-slate-700 font-medium">
                                                    {formatCurrency(parcel.parcelDetails.value)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm">
                                                        <div className="flex items-center space-x-1">
                                                            <span>{getServiceIcon(parcel.shipping.service)}</span>
                                                            <span className="capitalize">{parcel.shipping.service}</span>
                                                        </div>
                                                        <p className="text-slate-500">{formatCurrency(parcel.shipping.cost)}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div
                                                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(parcel.status)}`}
                                                        >
                                                            {parcel.status.toUpperCase()}
                                                        </div>
                                                        {parcel.paymentStatus && (
                                                            <div
                                                                className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(parcel.paymentStatus)}`}
                                                            >
                                                                {parcel.paymentStatus}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm">
                                                        <p className="text-slate-700">{formatDate(parcel.shipping.estimatedDelivery)}</p>
                                                        {isDeliveryUrgent(parcel.shipping.estimatedDelivery) && (
                                                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                                                                Urgent
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
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
                            <span className="text-4xl">📦</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">No parcels found</h3>
                        <p className="text-slate-600 mb-6">
                            {search || statusFilter !== "all" || categoryFilter !== "all"
                                ? "Try adjusting your search criteria or filters."
                                : "You haven't created any parcels yet."}
                        </p>
                        {(search || statusFilter !== "all" || categoryFilter !== "all") && (
                            <button
                                onClick={() => {
                                    setSearch("")
                                    setStatusFilter("all")
                                    setCategoryFilter("all")
                                }}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
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
                                Showing <span className="font-medium">{myParcels?.length}</span> of{" "}
                                <span className="font-medium">{totalParcels}</span> parcels
                            </p>
                            <div className="flex items-center space-x-2">
                                <label className="text-sm text-slate-600">Per page:</label>
                                <select
                                    className="border border-slate-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                                {Array.from({ length: Math.min(5, Math.ceil(totalParcels / limit)) }, (_, i) => {
                                    const pageNum = i + 1
                                    return (
                                        <button
                                            key={pageNum}
                                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${page === pageNum
                                                ? "bg-indigo-600 text-white"
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
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${page >= Math.ceil(totalParcels / limit)
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                                    }`}
                                onClick={() => setPage((p) => Math.min(Math.ceil(totalParcels / limit), p + 1))}
                                disabled={page >= Math.ceil(totalParcels / limit)}
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

