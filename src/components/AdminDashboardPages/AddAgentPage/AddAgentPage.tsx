"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAddAgentMutation } from "@/redux/features/AdminApi/AdminApi"
import React, { useState } from "react"
import Swal from "sweetalert2"

export default function AddAgentPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "agent",
        phone: "",
        address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
        },
    })
    const [addUser, { isLoading }] = useAddAgentMutation()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        if (name.startsWith("address.")) {
            setForm({
                ...form,
                address: {
                    ...form.address,
                    [name.split(".")[1]]: value,
                },
            })
        } else {
            setForm({ ...form, [name]: value })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await addUser(form).unwrap()
            Swal.fire({
                icon: "success",
                title: "User Added!",
                text: `Successfully added ${form.role}.`,
                timer: 1500,
                showConfirmButton: false,
            })
            setForm({
                name: "",
                email: "",
                password: "",
                role: "agent",
                phone: "",
                address: { street: "", city: "", state: "", zipCode: "", country: "" },
            })
        } catch (err: any) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err?.data?.message || "Failed to add user.",
            })
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
            <h2 className="text-2xl font-bold mb-6 text-center">Add Admin or Agent</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Password</label>
                    <input type="password" name="password" value={form.password} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Phone</label>
                    <input type="text" name="phone" value={form.phone} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Street</label>
                    <input type="text" name="address.street" value={form.address.street} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                    <label className="block mb-1 font-medium">City</label>
                    <input type="text" name="address.city" value={form.address.city} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                    <label className="block mb-1 font-medium">State</label>
                    <input type="text" name="address.state" value={form.address.state} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Zip Code</label>
                    <input type="text" name="address.zipCode" value={form.address.zipCode} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Country</label>
                    <input type="text" name="address.country" value={form.address.country} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Role</label>
                    <select name="role" value={form.role} onChange={handleChange} className="w-full border px-3 py-2 rounded">
                        <option value="agent">Agent</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded font-semibold">
                    {isLoading ? "Adding..." : "Add User"}
                </button>
            </form>
        </div>
    )
}