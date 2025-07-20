/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import LoadingPage from '@/app/loading';
import { useGetMeQuery, } from '@/redux/features/auth/authApi';
import { useUpdateProfileMutation } from '@/redux/features/UserApi/UserApi';
import React, { useState } from 'react';
import { toast } from 'sonner';

export default function UserEditProfilePage() {
    const { data: userData, isLoading } = useGetMeQuery({});
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [form, setForm] = useState({
        name: userData?.data?.name || '',
        email: userData?.data?.email || '',
        phone: userData?.data?.phone || '',
        street: userData?.data?.address?.street || '',
        city: userData?.data?.address?.city || '',
        state: userData?.data?.address?.state || '',
        zipCode: userData?.data?.address?.zipCode || '',
        country: userData?.data?.address?.country || '',
    });
    const [success, setSuccess] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    React.useEffect(() => {
        if (userData?.data) {
            setForm({
                name: userData.data.name || '',
                email: userData.data.email || '',
                phone: userData.data.phone || '',
                street: userData.data.address?.street || '',
                city: userData.data.address?.city || '',
                state: userData.data.address?.state || '',
                zipCode: userData.data.address?.zipCode || '',
                country: userData.data.address?.country || '',
            });
        }
    }, [userData]);

    if (isLoading) {
        return <LoadingPage />;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess('');
        setErrorMsg('');
        try {
            const payload = {
                name: form.name,
                phone: form.phone,
                address: {
                    street: form.street,
                    city: form.city,
                    state: form.state,
                    zipCode: form.zipCode,
                    country: form.country,
                },
            };
            const res = await updateProfile(payload).unwrap();
            console.log(res);
            if (res.success) {
                setSuccess('Profile updated successfully!');
                toast.success('Profile updated successfully!');
            }
        } catch (err: any) {
            setErrorMsg(err?.data?.message || 'Update failed');
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        className="mt-1 block w-full border rounded px-3 py-2"
                        required
                        disabled
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Street</label>
                    <input
                        type="text"
                        name="street"
                        value={form.street}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded px-3 py-2"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input
                            type="text"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">State</label>
                        <input
                            type="text"
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded px-3 py-2"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                        <input
                            type="text"
                            name="zipCode"
                            value={form.zipCode}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Country</label>
                        <input
                            type="text"
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded px-3 py-2"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 mt-6"
                    disabled={isUpdating}
                >
                    {isUpdating ? 'Updating...' : 'Update Profile'}
                </button>
                {success && <div className="text-green-600 text-center mt-4">{success}</div>}
                {errorMsg && <div className="text-red-600 text-center mt-4">{errorMsg}</div>}
            </form>
        </div>
    );
}