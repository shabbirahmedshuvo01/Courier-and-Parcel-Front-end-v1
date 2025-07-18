/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Link from "next/link";
import { useGetMeQuery, useLoginMutation } from '@/redux/features/auth/authApi';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/features/auth/authSlice';

// 1. Zod schema
const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

// 2. Infer TypeScript type from schema
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {

    const [loginAccount, { isLoading }] = useLoginMutation();
    const { data: userData } = useGetMeQuery({});

    console.log('userData:', userData);
    const dispatch = useDispatch();

    // 3. React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    // 4. Submit handler
    const onSubmit = async (data: LoginFormData) => {
        try {
            // Call the login mutation
            const res = await loginAccount(data).unwrap();
            console.log('Login response:', res);

            if (res.success && res.token && res.data) {
                // localStorage.setItem('token', res.token);
                // localStorage.setItem('user', JSON.stringify(res.data));

                // Dispatch user data to Redux store
                dispatch(
                    setUser({
                        user: res.data,
                        access_token: res.token,
                        refresh_token: res.refresh_token
                    })
                );
                toast.success('Login successful');
                // Optionally redirect to dashboard or home page
            } else {
                toast.error('Login failed');
            }
        } catch (error: any) {
            toast.error('Login failed');
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-sm border border-gray-50 p-8 space-y-6">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 mb-6">Login account</h1>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email address"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your strong password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                {...register('password')}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-700 hover:underline">
                                Forgot Password
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>

                        <div className="text-center">
                            <span className="text-sm text-gray-600">
                                Create an account?{" "}
                                <Link href="/auth/register" className="text-green-600 hover:text-green-700 hover:underline font-medium">
                                    Sign Up
                                </Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}