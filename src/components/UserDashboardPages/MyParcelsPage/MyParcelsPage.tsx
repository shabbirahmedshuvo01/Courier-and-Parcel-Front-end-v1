"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { useGetMyParcelsOfUserQuery } from "@/redux/features/UserApi/UserApi"

interface Parcel {
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
    createdAt: string
    updatedAt: string
    [key: string]: any
}

export default function MyParcelsPage() {
    const [status, setStatus] = useState("all")
    const [weight, setWeight] = useState("")
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const limit = 10

    const { data, isLoading, error } = useGetMyParcelsOfUserQuery({
        queryData: {
            status: status !== "all" ? status : undefined,
            ...(weight && { "parcelDetails.weight[gte]": weight }),
            ...(search && { search }),
            select: "recipient,status,trackingNumber,parcelDetails,createdAt,updatedAt",
            sort: "-createdAt",
            page,
            limit,
        },
    })

    const totalCount = data?.count || 0
    const totalPages = Math.max(1, Math.ceil(totalCount / limit))

    const getStatusColor = (status: string) => {
        switch (status) {
            case "delivered":
                return "bg-emerald-100 text-emerald-800 border-emerald-200"
            case "in-transit":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "pending":
                return "bg-amber-100 text-amber-800 border-amber-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "electronics":
                return "📱"
            case "clothing":
                return "👕"
            case "books":
                return "📚"
            case "food":
                return "🍕"
            default:
                return "📦"
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 text-lg">Loading your parcels...</p>
                </div>
            </div>
        )
    }

    if (error) {
        let errorMsg = "An error occurred"
        if ("message" in error && typeof error.message === "string") {
            errorMsg = error.message
        } else if ("data" in error && typeof error.data === "string") {
            errorMsg = error.data
        }
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">❌</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
                        <p className="text-red-600">{errorMsg}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Parcels</h1>
                        <p className="text-slate-600">Track and manage all your deliveries in one place</p>
                        <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-slate-500">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                                <span>Total Parcels: {totalCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-slate-400">🔍</span>
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                placeholder="Search by recipient or tracking number"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                    setPage(1)
                                }}
                            />
                        </div>

                        <div className="relative">
                            <select
                                className="block w-full px-3 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out appearance-none"
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value)
                                    setPage(1)
                                }}
                            >
                                <option value="all">All Status</option>
                                <option value="delivered">Delivered</option>
                                <option value="pending">Pending</option>
                                <option value="in-transit">In Transit</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                type="number"
                                className="block w-full px-3 py-3 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                placeholder="Min Weight (kg)"
                                value={weight}
                                onChange={(e) => {
                                    setWeight(e.target.value)
                                    setPage(1)
                                }}
                                min={0}
                            />
                        </div>
                    </div>
                </div>

                {/* Parcels Grid */}
                {data?.data?.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                        {data.data.map((parcel: Parcel) => (
                            <div
                                key={parcel.trackingNumber}
                                className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-200 overflow-hidden"
                            >
                                {/* Card Header */}
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-2xl">{getCategoryIcon(parcel.parcelDetails?.category)}</span>
                                            <div>
                                                <p className="text-white font-semibold text-sm">Tracking Number</p>
                                                <p className="text-indigo-100 font-mono text-xs">{parcel.trackingNumber}</p>
                                            </div>
                                        </div>
                                        <div
                                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(parcel.status)}`}
                                        >
                                            {parcel.status}
                                        </div>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {/* Recipient Info */}
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                                                <span className="mr-2">👤</span>
                                                Recipient Details
                                            </h3>
                                            <div className="bg-slate-50 rounded-lg p-3 space-y-1">
                                                <p className="text-sm font-medium text-gray-900">{parcel.recipient?.name}</p>
                                                <p className="text-xs text-slate-600">{parcel.recipient?.email}</p>
                                                <p className="text-xs text-slate-600">{parcel.recipient?.phone}</p>
                                            </div>
                                        </div>

                                        {/* Address */}
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2 flex items-center text-sm">
                                                <span className="mr-2">📍</span>
                                                Delivery Address
                                            </h4>
                                            <div className="bg-slate-50 rounded-lg p-3">
                                                <p className="text-xs text-slate-700">{parcel.recipient?.address?.street}</p>
                                                <p className="text-xs text-slate-700">
                                                    {parcel.recipient?.address?.city}, {parcel.recipient?.address?.state}{" "}
                                                    {parcel.recipient?.address?.zipCode}
                                                </p>
                                                <p className="text-xs text-slate-600 capitalize">{parcel.recipient?.address?.country}</p>
                                            </div>
                                        </div>

                                        {/* Parcel Details */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-slate-50 rounded-lg p-3">
                                                <p className="text-xs text-slate-600 mb-1">Weight</p>
                                                <p className="font-semibold text-sm text-gray-900">{parcel.parcelDetails?.weight ?? "-"} kg</p>
                                            </div>
                                            <div className="bg-slate-50 rounded-lg p-3">
                                                <p className="text-xs text-slate-600 mb-1">Dimensions</p>
                                                <p className="font-semibold text-sm text-gray-900">
                                                    {parcel.parcelDetails?.dimensions
                                                        ? `${parcel.parcelDetails.dimensions.length}×${parcel.parcelDetails.dimensions.width}×${parcel.parcelDetails.dimensions.height} cm`
                                                        : "-"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {parcel.parcelDetails?.description && (
                                            <div className="bg-slate-50 rounded-lg p-3">
                                                <p className="text-xs text-slate-600 mb-1">Description</p>
                                                <p className="text-sm text-gray-900">{parcel.parcelDetails.description}</p>
                                            </div>
                                        )}

                                        {/* Dates */}
                                        <div className="flex justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                                            <div>
                                                <span className="font-medium">Created:</span>{" "}
                                                {parcel.createdAt ? new Date(parcel.createdAt).toLocaleDateString() : "-"}
                                            </div>
                                            <div>
                                                <span className="font-medium">Updated:</span>{" "}
                                                {parcel.updatedAt ? new Date(parcel.updatedAt).toLocaleDateString() : "-"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">📦</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No parcels found</h3>
                        <p className="text-slate-600">Try adjusting your search criteria or check back later.</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <p className="text-sm text-slate-700">
                                    Showing page <span className="font-medium">{page}</span> of{" "}
                                    <span className="font-medium">{totalPages}</span>
                                </p>
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
                )}
            </div>
        </div>
    )
}
