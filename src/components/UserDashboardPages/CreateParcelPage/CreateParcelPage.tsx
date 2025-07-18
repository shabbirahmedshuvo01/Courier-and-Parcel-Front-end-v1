/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Package, MapPin, Truck, DollarSign, Zap, Clock, Shield } from "lucide-react";
import { useCreateParcelMutation } from "@/redux/features/UserApi/UserApi";
import { toast } from "sonner";

type Address = {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
};

type Recipient = {
    name: string;
    email: string;
    phone: string;
    address: Address;
};

type Dimensions = {
    length: string;
    width: string;
    height: string;
};

type ParcelDetails = {
    weight: string;
    dimensions: Dimensions;
    description: string;
    value: string;
    category: string;
};

type Shipping = {
    service: string;
};

type FormData = {
    recipient: Recipient;
    parcelDetails: ParcelDetails;
    shipping: Shipping;
};

export default function CreateParcelPage() {

    const [createParcel] = useCreateParcelMutation();

    const [formData, setFormData] = useState<FormData>({
        recipient: {
            name: "",
            email: "",
            phone: "",
            address: {
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "",
            },
        },
        parcelDetails: {
            weight: "",
            dimensions: {
                length: "",
                width: "",
                height: "",
            },
            description: "",
            value: "",
            category: "",
        },
        shipping: {
            service: "standard",
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Convert string numbers to actual numbers
        const payload = {
            ...formData,
            parcelDetails: {
                ...formData.parcelDetails,
                weight: Number(formData.parcelDetails.weight),
                value: Number(formData.parcelDetails.value),
                dimensions: {
                    length: Number(formData.parcelDetails.dimensions.length),
                    width: Number(formData.parcelDetails.dimensions.width),
                    height: Number(formData.parcelDetails.dimensions.height),
                }
            }
        };

        console.log("Form submitted:", payload);

        try {
            const res = await createParcel(payload).unwrap();
            console.log("Parcel created successfully:", res);
            if (res.success) {
                toast.success("Parcel created successfully!");
            }
        } catch (error) {
            console.error("Error creating parcel:", error);
            toast.error("Failed to create parcel. Please try again.");
        }
    };

    function updateFormData<T extends keyof FormData, K extends keyof FormData[T], S extends keyof any>(
        section: T,
        field: K,
        value: string,
        subField?: S
    ) {
        setFormData((prev) => {
            if (subField) {
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [field]: {
                            ...(prev[section][field] as Record<string, string>),
                            [subField]: value,
                        },
                    },
                };
            } else {
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [field]: value,
                    },
                };
            }
        });
    }

    const shippingOptions = [
        {
            id: "standard",
            name: "Standard Shipping",
            description: "5-7 business days",
            price: "$9.99",
            icon: <Truck className="h-5 w-5" />,
        },
        {
            id: "express",
            name: "Express Shipping",
            description: "2-3 business days",
            price: "$19.99",
            icon: <Zap className="h-5 w-5" />,
        },
        {
            id: "overnight",
            name: "Overnight Delivery",
            description: "Next business day",
            price: "$39.99",
            icon: <Clock className="h-5 w-5" />,
        },
    ];

    const categories = [
        "electronics",
        "clothing",
        "books",
        "home-garden",
        "sports",
        "toys",
        "jewelry",
        "documents",
        "other",
    ];

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Ship Your Package</h1>
                    <p className="text-gray-600">Fast, reliable, and secure shipping worldwide</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Recipient Information */}
                    <div className="shadow-lg rounded-lg bg-white">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg p-4">
                            <div className="flex items-center gap-2 text-xl font-semibold">
                                <MapPin className="h-5 w-5" />
                                Recipient Information
                            </div>
                            <div className="text-blue-100 text-sm">Where should we deliver your package?</div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name *</label>
                                    <input
                                        id="name"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Jane Smith"
                                        value={formData.recipient.name}
                                        onChange={(e) => updateFormData("recipient", "name", e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address *</label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="jane@example.com"
                                        value={formData.recipient.email}
                                        onChange={(e) => updateFormData("recipient", "email", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number *</label>
                                <input
                                    id="phone"
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="+1234567890"
                                    value={formData.recipient.phone}
                                    onChange={(e) => updateFormData("recipient", "phone", e.target.value)}
                                    required
                                />
                            </div>
                            <hr className="my-4" />
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900">Delivery Address</h4>
                                <div className="space-y-2">
                                    <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street Address *</label>
                                    <input
                                        id="street"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="456 Oak Ave"
                                        value={formData.recipient.address.street}
                                        onChange={(e) => updateFormData("recipient", "address", e.target.value, "street")}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City *</label>
                                        <input
                                            id="city"
                                            className="w-full border rounded px-3 py-2"
                                            placeholder="Dhaka"
                                            value={formData.recipient.address.city}
                                            onChange={(e) => updateFormData("recipient", "address", e.target.value, "city")}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">State/Province *</label>
                                        <input
                                            id="state"
                                            className="w-full border rounded px-3 py-2"
                                            placeholder="Dhaka"
                                            value={formData.recipient.address.state}
                                            onChange={(e) => updateFormData("recipient", "address", e.target.value, "state")}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">ZIP/Postal Code *</label>
                                        <input
                                            id="zipCode"
                                            className="w-full border rounded px-3 py-2"
                                            placeholder="1207"
                                            value={formData.recipient.address.zipCode}
                                            onChange={(e) => updateFormData("recipient", "address", e.target.value, "zipCode")}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country *</label>
                                        <select
                                            id="country"
                                            className="w-full border rounded px-3 py-2"
                                            value={formData.recipient.address.country}
                                            onChange={(e) => updateFormData("recipient", "address", e.target.value, "country")}
                                            required
                                        >
                                            <option value="">Select country</option>
                                            <option value="bangladesh">Bangladesh</option>
                                            <option value="usa">United States</option>
                                            <option value="canada">Canada</option>
                                            <option value="uk">United Kingdom</option>
                                            <option value="australia">Australia</option>
                                            <option value="germany">Germany</option>
                                            <option value="france">France</option>
                                            <option value="japan">Japan</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Parcel Details */}
                    <div className="shadow-lg rounded-lg bg-white">
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg p-4">
                            <div className="flex items-center gap-2 text-xl font-semibold">
                                <Package className="h-5 w-5" />
                                Parcel Details
                            </div>
                            <div className="text-green-100 text-sm">Tell us about your package</div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (kg) *</label>
                                    <input
                                        id="weight"
                                        type="number"
                                        step="0.1"
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="2.5"
                                        value={formData.parcelDetails.weight}
                                        onChange={(e) => updateFormData("parcelDetails", "weight", e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category *</label>
                                    <select
                                        id="category"
                                        className="w-full border rounded px-3 py-2"
                                        value={formData.parcelDetails.category}
                                        onChange={(e) => updateFormData("parcelDetails", "category", e.target.value)}
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category.charAt(0).toUpperCase() + category.slice(1).replace("-", " & ")}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900">Dimensions (cm)</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="length" className="block text-sm font-medium text-gray-700">Length *</label>
                                        <input
                                            id="length"
                                            type="number"
                                            className="w-full border rounded px-3 py-2"
                                            placeholder="10"
                                            value={formData.parcelDetails.dimensions.length}
                                            onChange={(e) => updateFormData("parcelDetails", "dimensions", e.target.value, "length")}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="width" className="block text-sm font-medium text-gray-700">Width *</label>
                                        <input
                                            id="width"
                                            type="number"
                                            className="w-full border rounded px-3 py-2"
                                            placeholder="8"
                                            value={formData.parcelDetails.dimensions.width}
                                            onChange={(e) => updateFormData("parcelDetails", "dimensions", e.target.value, "width")}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="height" className="block text-sm font-medium text-gray-700">Height *</label>
                                        <input
                                            id="height"
                                            type="number"
                                            className="w-full border rounded px-3 py-2"
                                            placeholder="6"
                                            value={formData.parcelDetails.dimensions.height}
                                            onChange={(e) => updateFormData("parcelDetails", "dimensions", e.target.value, "height")}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="value" className="block text-sm font-medium text-gray-700">Declared Value ($) *</label>
                                <input
                                    id="value"
                                    type="number"
                                    step="0.01"
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="299.99"
                                    value={formData.parcelDetails.value}
                                    onChange={(e) => updateFormData("parcelDetails", "value", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Package Description *</label>
                                <textarea
                                    id="description"
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Electronics package - smartphone and accessories"
                                    value={formData.parcelDetails.description}
                                    onChange={(e) => updateFormData("parcelDetails", "description", e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Shipping Options */}
                    <div className="shadow-lg rounded-lg bg-white">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg p-4">
                            <div className="flex items-center gap-2 text-xl font-semibold">
                                <Truck className="h-5 w-5" />
                                Shipping Options
                            </div>
                            <div className="text-purple-100 text-sm">Choose your preferred delivery speed</div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {shippingOptions.map((option) => (
                                    <label
                                        key={option.id}
                                        className={`flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${formData.shipping.service === option.id ? "border-blue-500 bg-blue-50" : ""
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="shippingService"
                                            value={option.id}
                                            checked={formData.shipping.service === option.id}
                                            onChange={() => updateFormData("shipping", "service", option.id)}
                                            className="form-radio h-5 w-5 text-blue-600"
                                        />
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="p-2 bg-gray-100 rounded-full">{option.icon}</div>
                                            <div className="flex-1">
                                                <span className="font-semibold">{option.name}</span>
                                                <p className="text-sm text-gray-600">{option.description}</p>
                                            </div>
                                            <span className="px-2 py-1 rounded bg-gray-200 font-semibold">{option.price}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Summary & Submit */}
                    <div className="shadow-lg rounded-lg bg-white">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-green-600" />
                                    <span className="font-semibold">Secure & Insured Shipping</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-blue-600" />
                                    <span className="font-semibold">Competitive Rates</span>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 text-lg rounded"
                            >
                                Create Shipping Label
                            </button>
                            <p className="text-sm text-gray-500 text-center mt-2">
                                By submitting, you agree to our terms of service and privacy policy
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}