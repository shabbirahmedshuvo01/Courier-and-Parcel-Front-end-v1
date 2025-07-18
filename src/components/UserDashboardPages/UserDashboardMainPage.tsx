/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetMyParcelsQuery } from '@/redux/features/UserApi/UserApi'
import React from 'react'

interface Parcel {
    _id: string;
    recipient: {
        name: string;
        email: string;
        phone: string;
        address: {
            street: string;
            city: string;
            state: string;
            zipCode: string;
            country: string;
        };
    };
    parcelDetails: {
        dimensions: {
            length: number;
            width: number;
            height: number;
        };
        weight: number;
        description: string;
        value: number;
        category: string;
    };
    shipping: {
        service: string;
        cost: number;
        estimatedDelivery: string;
    };
    sender: string;
    status: string;
    paymentStatus: string;
    trackingNumber: string;
    statusHistory: any[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}


export default function UserDashboardMainPage() {

    const { data, error, isLoading } = useGetMyParcelsQuery({
        queryData: {
            page: 1,
            limit: 10,
        }
    });

    const myParcels = data?.data || [];

    console.log(myParcels, error, isLoading);

    return (
        <div>
            {isLoading && <p>Loading...</p>}
            {error && <p>Error fetching parcels</p>}
            {/* return ( */}
            <div>
                {isLoading && <p>Loading...</p>}
                {error && <p>Error fetching parcels</p>}
                {data && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 bg-white rounded-lg">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 text-left">Recipient</th>
                                    <th className="px-4 py-2 text-left">Address</th>
                                    <th className="px-4 py-2 text-left">Category</th>
                                    <th className="px-4 py-2 text-left">Weight (kg)</th>
                                    <th className="px-4 py-2 text-left">Value ($)</th>
                                    <th className="px-4 py-2 text-left">Shipping</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                    <th className="px-4 py-2 text-left">Tracking #</th>
                                    <th className="px-4 py-2 text-left">Est. Delivery</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myParcels.map((parcel: Parcel) => (
                                    <tr key={parcel._id} className="border-t">
                                        <td className="px-4 py-2">{parcel.recipient.name}</td>
                                        <td className="px-4 py-2">
                                            {parcel.recipient.address.street}, {parcel.recipient.address.city}, {parcel.recipient.address.state}, {parcel.recipient.address.zipCode}, {parcel.recipient.address.country}
                                        </td>
                                        <td className="px-4 py-2">{parcel.parcelDetails.category}</td>
                                        <td className="px-4 py-2">{parcel.parcelDetails.weight}</td>
                                        <td className="px-4 py-2">${parcel.parcelDetails.value}</td>
                                        <td className="px-4 py-2">
                                            {parcel.shipping.service} (${parcel.shipping.cost.toFixed(2)})
                                        </td>
                                        <td className="px-4 py-2">
                                            <span className="px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs">{parcel.status}</span>
                                        </td>
                                        <td className="px-4 py-2 font-mono text-green-600">{parcel.trackingNumber}</td>
                                        <td className="px-4 py-2 text-xs text-gray-500">
                                            {new Date(parcel.shipping.estimatedDelivery).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {/* ) */}
        </div>
    )
}
