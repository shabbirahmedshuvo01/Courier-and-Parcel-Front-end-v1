/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import LoadingPage from "@/app/loading"
import { useGetAllParcelsQuery, useGetAllUsersQuery } from "@/redux/features/AdminApi/AdminApi"
import { useDeleteParcelMutation } from "@/redux/features/AdminApi/AdminApi"
import { use, useState } from "react"
import Swal from "sweetalert2"

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
    sender: {
        _id: string
        name: string
        email: string
    }
    status: string
    paymentStatus: string
    trackingNumber: string
    statusHistory: any[]
    createdAt: string
    updatedAt: string
    __v: number
}

export default function ManageParcelsPage() {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [serviceFilter, setServiceFilter] = useState("all")
    const [paymentFilter, setPaymentFilter] = useState("all")
    const [sortBy, setSortBy] = useState("createdAt")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
    const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
    const [selectedParcels, setSelectedParcels] = useState<string[]>([])

    // Backend filtering only
    const { data, isLoading, error } = useGetAllParcelsQuery({
        queryData: {
            page,
            limit,
            ...(search && { search }),
            ...(statusFilter !== "all" && { status: statusFilter }),
            ...(categoryFilter !== "all" && { category: categoryFilter }),
            ...(serviceFilter !== "all" && { service: serviceFilter }),
            ...(paymentFilter !== "all" && { paymentStatus: paymentFilter }),
            sort: `${sortOrder === "desc" ? "-" : ""}${sortBy}`,
        },
    })

    const { data: usersData } = useGetAllUsersQuery({ queryData: { role: "agent" } })

    console.log(usersData);

    const [deleteParcel, { isLoading: isDeleting }] = useDeleteParcelMutation()

    const parcels = data?.data || []
    const totalParcels = data?.count || 0
    const totalPages = Math.max(1, Math.ceil(totalParcels / limit))
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

    const exportToCSV = () => {
        const headers = [
            "Tracking Number",
            "Sender Name",
            "Sender Email",
            "Recipient Name",
            "Recipient Email",
            "Recipient Phone",
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

        const csvData = parcels?.map((parcel: Parcel) => [
            parcel.trackingNumber,
            parcel.sender.name,
            parcel.sender.email,
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
        a.download = `admin-parcels-${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
    }

    // const handleSelectParcel = (parcelId: string) => {
    //     setSelectedParcels((prev) => (prev.includes(parcelId) ? prev.filter((id) => id !== parcelId) : [...prev, parcelId]))
    // }

    const handleSelectAll = () => {
        if (selectedParcels.length === parcels.length) {
            setSelectedParcels([])
        } else {
            setSelectedParcels(parcels.map((p: Parcel) => p._id))
        }
    }

    if (isLoading) {
        return <LoadingPage />
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">❌</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Parcels</h3>
                    <p className="text-red-600 mb-6">Unable to fetch parcel data. Please try again later.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    const deliveredCount = parcels.filter((p: Parcel) => p.status === "delivered").length
    const pendingCount = parcels.filter((p: Parcel) => p.status === "pending").length
    const inTransitCount = parcels.filter((p: Parcel) => p.status === "in-transit").length
    const totalRevenue = parcels.reduce((sum: number, p: Parcel) => sum + p.shipping.cost, 0)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-100">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                Parcel Management
                            </h1>
                            <p className="text-slate-600 text-lg">Admin dashboard for managing all parcels</p>
                        </div>
                        <div className="mt-4 lg:mt-0 flex items-center space-x-4">
                            <button
                                onClick={exportToCSV}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                            >
                                <span>📊</span>
                                <span>Export CSV</span>
                            </button>
                            {selectedParcels.length > 0 && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-slate-600">{selectedParcels.length} selected</span>
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                                        Bulk Actions
                                    </button>
                                </div>
                            )}
                            <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm">
                                <button
                                    onClick={() => setViewMode("cards")}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${viewMode === "cards"
                                        ? "bg-orange-600 text-white"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                        }`}
                                >
                                    Cards
                                </button>
                                <button
                                    onClick={() => setViewMode("table")}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${viewMode === "table"
                                        ? "bg-orange-600 text-white"
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
                                <p className="text-pink-100 text-sm font-medium mb-1">Revenue</p>
                                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                            </div>
                            <div className="bg-white/20 rounded-full p-3">
                                <span className="text-2xl">💰</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Controls */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                        {/* Search */}
                        <div className="relative lg:col-span-2">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-slate-400 text-lg">🔍</span>
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl bg-white/70 backdrop-blur-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                placeholder="Search parcels, senders, recipients..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                    setPage(1)
                                }}
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <select
                                className="block w-full px-4 py-3 border border-slate-300 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 appearance-none"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="in-transit">In Transit</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <select
                                className="block w-full px-4 py-3 border border-slate-300 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 appearance-none"
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
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Service Filter */}
                        <div className="relative">
                            <select
                                className="block w-full px-4 py-3 border border-slate-300 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 appearance-none"
                                value={serviceFilter}
                                onChange={(e) => setServiceFilter(e.target.value)}
                            >
                                <option value="all">All Services</option>
                                <option value="express">Express</option>
                                <option value="overnight">Overnight</option>
                                <option value="standard">Standard</option>
                                <option value="economy">Economy</option>
                            </select>
                        </div>

                        {/* Payment Filter */}
                        <div className="relative">
                            <select
                                className="block w-full px-4 py-3 border border-slate-300 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 appearance-none"
                                value={paymentFilter}
                                onChange={(e) => setPaymentFilter(e.target.value)}
                            >
                                <option value="all">All Payments</option>
                                <option value="paid">Paid</option>
                                <option value="pending">Payment Pending</option>
                                <option value="failed">Payment Failed</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>

                        {/* Sort By */}
                        <div className="relative">
                            <select
                                className="block w-full px-4 py-3 border border-slate-300 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 appearance-none"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="createdAt">Created Date</option>
                                <option value="estimatedDelivery">Delivery Date</option>
                                <option value="value">Value</option>
                                <option value="weight">Weight</option>
                                <option value="cost">Shipping Cost</option>
                                <option value="recipient">Recipient</option>
                                <option value="sender">Sender</option>
                            </select>
                        </div>
                        {/* Sort Order */}
                        <div className="relative">
                            <select
                                className="block w-full px-4 py-3 border border-slate-300 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 appearance-none"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                            >
                                <option value="desc">Newest First</option>
                                <option value="asc">Oldest First</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <p className="text-sm text-slate-600">
                                Showing {parcels.length} of {totalParcels} parcels
                            </p>
                            {viewMode === "table" && (
                                <label className="flex items-center space-x-2 text-sm text-slate-600">
                                    <input
                                        type="checkbox"
                                        checked={selectedParcels.length === parcels.length}
                                        onChange={handleSelectAll}
                                        className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                                    />
                                    <span>Select All</span>
                                </label>
                            )}
                        </div>
                        {(search ||
                            statusFilter !== "all" ||
                            categoryFilter !== "all" ||
                            serviceFilter !== "all" ||
                            paymentFilter !== "all") && (
                                <button
                                    onClick={() => {
                                        setSearch("")
                                        setStatusFilter("all")
                                        setCategoryFilter("all")
                                        setServiceFilter("all")
                                        setPaymentFilter("all")
                                    }}
                                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                                >
                                    Clear Filters
                                </button>
                            )}
                    </div>
                </div>

                {/* Content */}
                {parcels.length > 0 ? (
                    viewMode === "cards" ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {parcels?.map((parcel: Parcel) => (
                                <div
                                    key={parcel._id}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-[1.02]"
                                >
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="font-semibold text-orange-600">{parcel.trackingNumber}</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${parcel.status === "delivered"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : parcel.status === "pending"
                                                    ? "bg-amber-100 text-amber-700"
                                                    : parcel.status === "in-transit"
                                                        ? "bg-purple-100 text-purple-700"
                                                        : "bg-slate-100 text-slate-700"
                                                }`}>
                                                {parcel.status}
                                            </span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-slate-500 text-xs">Sender:</span>
                                            <div className="font-medium">{parcel.sender.name} ({parcel.sender.email})</div>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-slate-500 text-xs">Recipient:</span>
                                            <div className="font-medium">{parcel.recipient.name} ({parcel.recipient.email})</div>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-slate-500 text-xs">Category:</span>
                                            <span className="ml-1">{parcel.parcelDetails.category}</span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-slate-500 text-xs">Weight:</span>
                                            <span className="ml-1">{parcel.parcelDetails.weight} kg</span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-slate-500 text-xs">Shipping:</span>
                                            <span className="ml-1">{parcel.shipping.service} ({formatCurrency(parcel.shipping.cost)})</span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-slate-500 text-xs">Created:</span>
                                            <span className="ml-1">{formatDate(parcel.createdAt)}</span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-slate-500 text-xs">Estimated Delivery:</span>
                                            <span className="ml-1">{formatDate(parcel.shipping.estimatedDelivery)}</span>
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
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">#</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Tracking Number</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Sender</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Recipient</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Category</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Weight</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Shipping</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Payment</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Created</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Est. Delivery</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {parcels.map((parcel: Parcel, index: number) => (
                                            <tr
                                                key={parcel._id}
                                                className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                                                    }`}
                                            >
                                                <td className="px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                                                <td className="px-4 py-3 text-sm font-semibold text-orange-600">{parcel.trackingNumber}</td>
                                                <td className="px-4 py-3 text-sm text-slate-700">
                                                    {parcel.sender.name}<br />
                                                    <span className="text-xs text-slate-400">{parcel.sender.email}</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-700">
                                                    {parcel.recipient.name}<br />
                                                    <span className="text-xs text-slate-400">{parcel.recipient.email}</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-700">{parcel.parcelDetails.category}</td>
                                                <td className="px-4 py-3 text-sm text-slate-700">{parcel.parcelDetails.weight} kg</td>
                                                <td className="px-4 py-3 text-sm text-slate-700">
                                                    {parcel.shipping.service}<br />
                                                    <span className="text-xs text-slate-400">{formatCurrency(parcel.shipping.cost)}</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${parcel.status === "delivered"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : parcel.status === "pending"
                                                            ? "bg-amber-100 text-amber-700"
                                                            : parcel.status === "in-transit"
                                                                ? "bg-purple-100 text-purple-700"
                                                                : parcel.status === "processing"
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : parcel.status === "cancelled"
                                                                        ? "bg-red-100 text-red-700"
                                                                        : "bg-slate-100 text-slate-700"
                                                        }`}>
                                                        {parcel.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${parcel.paymentStatus === "paid"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : parcel.paymentStatus === "pending"
                                                            ? "bg-amber-100 text-amber-700"
                                                            : parcel.paymentStatus === "failed"
                                                                ? "bg-red-100 text-red-700"
                                                                : parcel.paymentStatus === "refunded"
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : "bg-slate-100 text-slate-700"
                                                        }`}>
                                                        {parcel.paymentStatus}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-700">{formatDate(parcel.createdAt)}</td>
                                                <td className="px-4 py-3 text-sm text-slate-700">{formatDate(parcel.shipping.estimatedDelivery)}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <button
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                                        onClick={async () => {
                                                            if (window.confirm("Are you sure you want to delete this parcel?")) {
                                                                await deleteParcel(parcel._id)
                                                                Swal.fire({
                                                                    icon: "success",
                                                                    title: "Parcel deleted!",
                                                                    text: "The parcel has been successfully deleted.",
                                                                    timer: 1800,
                                                                    showConfirmButton: false,
                                                                })
                                                            }
                                                        }}
                                                        disabled={isDeleting}
                                                    >
                                                        Delete
                                                    </button>
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
                            {search ||
                                statusFilter !== "all" ||
                                categoryFilter !== "all" ||
                                serviceFilter !== "all" ||
                                paymentFilter !== "all"
                                ? "Try adjusting your search criteria or filters."
                                : "No parcels have been created yet."}
                        </p>
                        {(search ||
                            statusFilter !== "all" ||
                            categoryFilter !== "all" ||
                            serviceFilter !== "all" ||
                            paymentFilter !== "all") && (
                                <button
                                    onClick={() => {
                                        setSearch("")
                                        setStatusFilter("all")
                                        setCategoryFilter("all")
                                        setServiceFilter("all")
                                        setPaymentFilter("all")
                                    }}
                                    className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
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
                                Showing <span className="font-medium">{parcels.length}</span> of{" "}
                                <span className="font-medium">{totalParcels}</span> parcels
                            </p>
                            <div className="flex items-center space-x-2">
                                <label className="text-sm text-slate-600">Per page:</label>
                                <select
                                    className="border border-slate-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                                                ? "bg-orange-600 text-white"
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