import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, Shield, Users, BarChart3, CheckCircle2 } from "lucide-react";

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

    /* ---------------- Form ---------------- */
    const form = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    /* ---------------- Submit ---------------- */
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
        <div className="relative flex h-dvh flex-col overflow-hidden bg-[#F8F7FC]">
            <div className="flex flex-1 items-center justify-center px-4">

                <div className="w-full max-w-[1100px] bg-white rounded-lg shadow-lg flex">

                    {/* LEFT SIDE */}
                    <div className="flex-1 p-8">
                        <h1 className="text-2xl font-bold">Welcome back</h1>
                        <p className="text-sm text-gray-500 mb-6">
                            Sign in to continue
                        </p>

                        {!showForgotPassword ? (
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                                {/* EMAIL */}
                                <div>
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        placeholder="Enter email"
                                        {...form.register("email")}
                                    />
                                    {form.formState.errors.email && (
                                        <p className="text-red-500 text-sm">
                                            {form.formState.errors.email.message}
                                        </p>
                                    )}
                                </div>

                                {/* PASSWORD */}
                                <div>
                                    <Label>Password</Label>

                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter password"
                                            {...form.register("password")}
                                        />

                                        <button
                                            type="button"
                                            className="absolute right-3 top-2.5"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>

                                    {form.formState.errors.password && (
                                        <p className="text-red-500 text-sm">
                                            {form.formState.errors.password.message}
                                        </p>
                                    )}
                                </div>

                                {/* REMEMBER ME */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            checked={isRememberMe}
                                            onCheckedChange={(val) =>
                                                setIsRememberMe(Boolean(val))
                                            }
                                        />
                                        <span className="text-sm">Remember me</span>
                                    </div>

                                    <button
                                        type="button"
                                        className="text-sm text-purple-600"
                                        onClick={() => setShowForgotPassword(true)}
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                {/* SUBMIT */}
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? "Signing in..." : "Sign In"}
                                </Button>
                            </form>
                        ) : (
                            <div>
                                <p>Forgot Password Form Placeholder</p>
                                <button
                                    onClick={() => setShowForgotPassword(false)}
                                    className="text-purple-600"
                                >
                                    Back
                                </button>
                            </div>
                        )}

                        {/* FOOTER */}
                        <div className="mt-6 text-xs text-gray-500 text-center">
                            © {new Date().getFullYear()} HR System
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-700 to-indigo-900 text-white p-8 flex-col justify-between">

                        <div>
                            <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                                Live Dashboard
                            </span>

                            <h2 className="mt-6 text-2xl font-bold">
                                Manage your workforce with confidence
                            </h2>

                            <p className="text-sm mt-3 text-white/80">
                                Streamline HR operations and track performance.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white/10 p-3 rounded-lg flex justify-between">
                                <div>
                                    <p className="text-xs">Active Clients</p>
                                    <p className="text-xl font-bold">6</p>
                                </div>
                                <Users />
                            </div>

                            <div className="bg-white/10 p-3 rounded-lg flex justify-between">
                                <div>
                                    <p className="text-xs">Performance</p>
                                    <p className="text-xl font-bold">92.4%</p>
                                </div>
                                <BarChart3 />
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}