import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

/* ---------------- Schema ---------------- */

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
    const { login } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [isRememberMe, setIsRememberMe] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginForm) => {
        try {
            setIsLoading(true);

            login({
                email: data.email,
                password: data.password,
                isRemember: isRememberMe,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex h-dvh bg-gradient-to-br from-gray-50 to-gray-100">

            {/* CENTER WRAPPER */}
            <div className="m-auto w-full max-w-5xl px-4">

                <div className="grid lg:grid-cols-2 bg-white shadow-2xl rounded-2xl overflow-hidden">

                    {/* ---------------- LEFT SIDE ---------------- */}
                    <div className="p-10">

                        {/* HEADER */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold tracking-tight">
                                Welcome back
                            </h1>

                            <p className="text-sm text-gray-500 mt-2">
                                Sign in to your account to continue
                            </p>
                        </div>

                        {/* FORM */}
                        {!showForgotPassword ? (
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-5"
                            >

                                {/* EMAIL */}
                                <div>
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        placeholder="you@example.com"
                                        className="mt-1"
                                        {...form.register("email")}
                                    />
                                    {form.formState.errors.email && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {form.formState.errors.email.message}
                                        </p>
                                    )}
                                </div>

                                {/* PASSWORD */}
                                <div>
                                    <Label>Password</Label>

                                    <div className="relative mt-1">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            {...form.register("password")}
                                            className="pr-10"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>

                                    {form.formState.errors.password && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {form.formState.errors.password.message}
                                        </p>
                                    )}
                                </div>

                                {/* OPTIONS */}
                                <div className="flex items-center justify-between">

                                    <label className="flex items-center gap-2 text-sm">
                                        <Checkbox
                                            checked={isRememberMe}
                                            onCheckedChange={(val) =>
                                                setIsRememberMe(Boolean(val))
                                            }
                                        />
                                        Remember me
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowForgotPassword(true)
                                        }
                                        className="text-sm text-purple-600 hover:underline"
                                    >
                                        Forgot password?
                                    </button>

                                </div>

                                {/* BUTTON */}
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full rounded-xl"
                                >
                                    {isLoading ? "Signing in..." : "Sign In"}
                                </Button>

                                {/* FOOTER */}
                                <p className="text-center text-xs text-gray-400 mt-6">
                                    © {new Date().getFullYear()} Your Company. All rights reserved.
                                </p>

                            </form>
                        ) : (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">
                                    Reset Password
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Enter your email and we’ll send reset instructions.
                                </p>

                                <Input placeholder="you@example.com" />

                                <div className="flex gap-2">
                                    <Button className="w-full">
                                        Send Link
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            setShowForgotPassword(false)
                                        }
                                    >
                                        Back
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ---------------- RIGHT SIDE ---------------- */}
                    <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-purple-700 via-indigo-700 to-indigo-900 text-white">

                        {/* TOP */}
                        <div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-6 w-6" />
                                <span className="font-semibold">
                                    Secure Access
                                </span>
                            </div>

                            <h2 className="text-2xl font-bold mt-6 leading-snug">
                                Manage users, roles & permissions in one place
                            </h2>

                            <p className="text-sm text-white/70 mt-3">
                                A modern RBAC system for scalable SaaS applications.
                            </p>
                        </div>

                        {/* BOTTOM */}
                        <div className="text-xs text-white/60">
                            Built with secure authentication & role-based access control.
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}