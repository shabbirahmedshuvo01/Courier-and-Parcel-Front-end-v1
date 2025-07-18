/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useGetMyParcelMainQuery } from "@/redux/features/UserApi/UserApi"
import { useState } from "react"

interface Parcel {
    _id: string
    trackingNumber: string
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
        weight: number
        dimensions: {
            length: number
            width: number
            height: number
        }
        description: string
        value: number
        category: string
    }
    shipping: {
        service: string
        cost: number
        estimatedDelivery: string
    }
    status: string
    paymentStatus: string
    sender: string
    statusHistory: any[]
    createdAt: string
    updatedAt: string
    __v: number
}

export default function MyParcelsMainPage() {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [paymentFilter, setPaymentFilter] = useState("all")

    const { data, isLoading, error } = useGetMyParcelMainQuery({
        queryData: {
            page,
            limit: 10,
            ...(search && { search }),
            ...(statusFilter !== "all" && { status: statusFilter }),
            ...(paymentFilter !== "all" && { paymentStatus: paymentFilter }),
        },
    });

    // const filteredData =
    //     data?.data?.filter((parcel: Parcel) => {
    //         const matchesSearch =
    //             search === "" ||
    //             parcel.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
    //             parcel.recipient.name.toLowerCase().includes(search.toLowerCase()) ||
    //             parcel.recipient.email.toLowerCase().includes(search.toLowerCase())

    //         const matchesStatus = statusFilter === "all" || parcel.status === statusFilter
    //         const matchesPayment = paymentFilter === "all" || parcel.paymentStatus === paymentFilter

    //         return matchesSearch && matchesStatus && matchesPayment
    //     }) || []

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
        switch (status.toLowerCase()) {
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

    const getServiceIcon = (service: string) => {
        switch (service.toLowerCase()) {
            case "express":
                return "⚡"
            case "overnight":
                return "🌙"
            case "standard":
                return "📦"
            default:
                return "🚚"
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
            case "other":
                return "📦"
            default:
                return "📦"
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
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const isDeliveryUrgent = (estimatedDelivery: string) => {
        const deliveryDate = new Date(estimatedDelivery)
        const now = new Date()
        const diffHours = (deliveryDate.getTime() - now.getTime()) / (1000 * 60 * 60)
        return diffHours <= 24 && diffHours > 0
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl">📦</span>
                        </div>
                    </div>
                    <p className="text-slate-600 text-lg font-medium">Loading your parcels...</p>
                    <p className="text-slate-500 text-sm mt-1">Please wait while we fetch your data</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">❌</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Oops! Something went wrong</h3>
                    <p className="text-red-600 mb-6">Unable to load your parcels. Please try again later.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    const totalParcels = data?.count || 0
    const deliveredCount = data?.data?.filter((p: Parcel) => p.status === "delivered").length || 0
    const pendingCount = data?.data?.filter((p: Parcel) => p.status === "pending").length || 0
    const inTransitCount = data?.data?.filter((p: Parcel) => p.status === "in-transit").length || 0

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
                            My Parcels Dashboard
                        </h1>
                        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                            Track, manage, and monitor all your shipments in one beautiful interface
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                </div>

                {/* Filters */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
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
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        <div className="relative">
                            <select
                                className="block w-full px-4 py-3 border border-slate-300 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none"
                                value={paymentFilter}
                                onChange={(e) => setPaymentFilter(e.target.value)}
                            >
                                <option value="all">All Payments</option>
                                <option value="paid">Paid</option>
                                <option value="pending">Payment Pending</option>
                                <option value="failed">Payment Failed</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        <div className="flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-semibold">
                            <span className="text-sm">
                                {data?.data?.length} of {totalParcels} parcels
                            </span>
                        </div>
                    </div>
                </div>

                {/* Parcels Grid */}
                {data?.data?.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {data?.data?.map((parcel: Parcel) => (
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
                                            <div
                                                className={`px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(parcel.paymentStatus)}`}
                                            >
                                                {parcel.paymentStatus}
                                            </div>
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
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">📦</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">No parcels found</h3>
                        <p className="text-slate-600 mb-6">
                            {search || statusFilter !== "all" || paymentFilter !== "all"
                                ? "Try adjusting your search criteria or filters."
                                : "You haven't created any parcels yet."}
                        </p>
                        {(search || statusFilter !== "all" || paymentFilter !== "all") && (
                            <button
                                onClick={() => {
                                    setSearch("")
                                    setStatusFilter("all")
                                    setPaymentFilter("all")
                                }}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {totalParcels > 0 && (
                <div className="flex justify-center items-center gap-4 mt-10">
                    <button
                        className={`px-4 py-2 rounded border ${page === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-100 text-gray-700'}`}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {page} of {Math.max(1, Math.ceil(totalParcels / 10))}
                    </span>
                    <button
                        className={`px-4 py-2 rounded border ${page >= Math.ceil(totalParcels / 10) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-100 text-gray-700'}`}
                        onClick={() => setPage(p => Math.min(Math.ceil(totalParcels / 10), p + 1))}
                        disabled={page >= Math.ceil(totalParcels / 10)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}
