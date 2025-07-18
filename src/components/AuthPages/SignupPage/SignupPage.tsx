/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Link from "next/link";
import React from 'react';
import { useRegisterMutation } from '@/redux/features/auth/authApi';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/features/auth/authSlice';

const signupSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string().min(6, { message: 'Confirm password is required' }),
    role: z.enum(['customer', 'admin', 'courier'], { message: 'Please select a role' }),
    phone: z.string().min(10, { message: 'Phone number is required' }),
    address: z.object({
        street: z.string().min(2, { message: 'Street is required' }),
        city: z.string().min(2, { message: 'City is required' }),
        state: z.string().min(2, { message: 'State is required' }),
        zipCode: z.string().min(2, { message: 'Zip code is required' }),
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});


// 2. Infer TypeScript type from schema
type SignupFormData = z.infer<typeof signupSchema>;

interface RoleOption {
    value: "customer" | "courier" | "admin";
    label: string;
    icon: string;
}


export default function SignupPage() {

    const [signUpAccount, { isLoading }] = useRegisterMutation();
    const dispatch = useDispatch();

    const [selectedRole, setSelectedRole] = React.useState<"customer" | "courier" | "admin">("customer");

    const roles: RoleOption[] = [
        { value: "customer", label: "Customer", icon: "👤" },
        { value: "courier", label: "Courier", icon: "🚚" },
        // { value: "admin", label: "Admin", icon: "👨‍💼" }
    ];


    // 3. React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            role: selectedRole,
            address: {
                street: "",
                city: "",
                state: "",
                zipCode: "",
            }
        }
    })

    // Update role in form when selectedRole changes
    React.useEffect(() => {
        setValue('role', selectedRole);
    }, [selectedRole, setValue]);

    // 4. Submit handler
    const onSubmit = async (data: SignupFormData) => {
        try {
            // Remove confirmPassword before sending to backend
            const payload: Omit<SignupFormData, 'confirmPassword'> & { confirmPassword?: string } = { ...data };
            delete payload.confirmPassword;
            console.log('Signup payload:', payload);

            const res = await signUpAccount(payload).unwrap();
            if (res?.success && res?.token && res?.data) {
                dispatch(
                    setUser({
                        user: res.data,
                        access_token: res.token,
                        refresh_token: res.refresh_token // if you have a refresh token
                    })
                );
                toast.success('Account created successfully!');
            }
            toast.success('Account created successfully!');
            // Add your API signup call here
        } catch (error: any) {
            toast.error('Signup failed');
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                <div className="bg-white rounded-lg shadow-sm border p-8 space-y-6">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 mb-2">Create account</h1>
                        <p className="text-sm text-gray-600">Join our courier management system</p>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">
                            Select Your Role
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {roles.map((role) => (
                                <button
                                    key={role.value}
                                    type="button"
                                    onClick={() => setSelectedRole(role.value)}
                                    className={`p-3 rounded-lg border-2 transition-all text-center ${selectedRole === role.value
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="text-lg mb-1">{role.icon}</div>
                                    <div className="text-xs font-medium">{role.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                        {/* Hidden role field */}
                        <input type="hidden" {...register('role')} />

                        {/* Name Field */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Enter your full name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                {...register('name')}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>
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

                        {/* Password Fields */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Create a strong password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                {...register('password')}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                {...register('confirmPassword')}
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-2">
                            <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                type="text"
                                placeholder="Enter your phone number"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                {...register('phone')}
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                            )}
                        </div>

                        {/* Address Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="street" className="text-sm font-medium text-gray-700">
                                    Street
                                </label>
                                <input
                                    id="street"
                                    type="text"
                                    placeholder="Street address"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    {...register('address.street')}
                                />
                                {errors.address?.street && (
                                    <p className="text-red-500 text-sm mt-1">{errors.address.street.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="city" className="text-sm font-medium text-gray-700">
                                    City
                                </label>
                                <input
                                    id="city"
                                    type="text"
                                    placeholder="City"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    {...register('address.city')}
                                />
                                {errors.address?.city && (
                                    <p className="text-red-500 text-sm mt-1">{errors.address.city.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="state" className="text-sm font-medium text-gray-700">
                                    State
                                </label>
                                <input
                                    id="state"
                                    type="text"
                                    placeholder="State"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    {...register('address.state')}
                                />
                                {errors.address?.state && (
                                    <p className="text-red-500 text-sm mt-1">{errors.address.state.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="zipCode" className="text-sm font-medium text-gray-700">
                                    Zip Code
                                </label>
                                <input
                                    id="zipCode"
                                    type="text"
                                    placeholder="Zip code"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    {...register('address.zipCode')}
                                />
                                {errors.address?.zipCode && (
                                    <p className="text-red-500 text-sm mt-1">{errors.address.zipCode.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start space-x-2">
                            <input
                                type="checkbox"
                                id="terms"
                                className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                required
                            />
                            <label htmlFor="terms" className="text-sm text-gray-600">
                                I agree to the{" "}
                                <Link href="/terms" className="text-green-600 hover:text-green-700 hover:underline">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy" className="text-green-600 hover:text-green-700 hover:underline">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>

                        <div className="text-center">
                            <span className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <Link href="/login" className="text-green-600 hover:text-green-700 hover:underline font-medium">
                                    Sign In
                                </Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}