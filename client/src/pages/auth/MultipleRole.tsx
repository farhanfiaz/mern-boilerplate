import { useAuth } from "@/context/AuthContext";
import { Redirect, useLocation } from "wouter";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
    Shield,
    LogIn,
} from "lucide-react";
import { publishEvent } from "@/lib/appEvents";

export default function MultipleRole() {
    const { user } = useAuth();
    const [, setLocation] = useLocation();

    const [selectedRole, setSelectedRole] = useState<string>("");

    if (!user) return <Redirect to="/login" />;

    const roles = user.user.role || [];

    /* ---------------- AUTO SKIP ---------------- */
    if (roles.length <= 1) {
        const defaultRole = roles.at(0)?.id;
        if (defaultRole) {
            localStorage.setItem("selectedRole", defaultRole);
            setLocation("/dashboard");
        }
        return null;
    }

    /* ---------------- CONTINUE ---------------- */
    const handleContinue = () => {
        if (!selectedRole) return;

        localStorage.setItem("selectedRole", selectedRole);
        setLocation("/dashboard");

        publishEvent({ type: "ROLE_SELECTED", roleId: selectedRole });
    };

    return (
        <div className="h-dvh flex bg-gray-50">

            {/* ---------------- LEFT SIDE (BRANDING) ---------------- */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-700 via-indigo-700 to-indigo-900 text-white p-10 flex-col justify-between">

                <div>
                    <div className="flex items-center gap-2">
                        <Shield className="h-6 w-6" />
                        <span className="font-semibold">
                            Role Based Access System
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold mt-8 leading-snug">
                        Select your role to continue
                    </h1>

                    <p className="text-white/70 mt-3 text-sm">
                        You have multiple roles assigned in the system.
                        Choose one to access your dashboard securely.
                    </p>
                </div>

                <div className="text-xs text-white/50">
                    Secure RBAC • Multi Tenant Ready • SaaS Architecture
                </div>

            </div>

            {/* ---------------- RIGHT SIDE (ROLE SELECT) ---------------- */}
            <div className="flex flex-1 items-center justify-center p-6">

                <Card className="w-full max-w-md p-8 space-y-6 shadow-xl rounded-2xl">

                    {/* HEADER */}
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold">
                            Choose Role
                        </h2>

                        <p className="text-sm text-gray-500">
                            Select how you want to continue
                        </p>
                    </div>

                    {/* ROLE DROPDOWN */}
                    <div className="space-y-2">

                        <label className="text-sm font-medium">
                            Available Roles
                        </label>

                        <select
                            className="w-full border rounded-md p-3 bg-white"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <option value="">Select role...</option>

                            {roles.map((role: any) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>

                    </div>

                    {/* SELECTED PREVIEW */}
                    {selectedRole && (
                        <div className="p-3 rounded-lg bg-gray-50 border flex items-center justify-between">

                            <span className="text-sm font-medium">
                                Selected Role
                            </span>

                            <Badge variant="secondary">
                                {roles.find((r: any) => r.id === selectedRole)?.name}
                            </Badge>

                        </div>
                    )}

                    {/* CONTINUE BUTTON */}
                    <Button
                        onClick={handleContinue}
                        disabled={!selectedRole}
                        className="w-full"
                    >
                        <LogIn className="h-4 w-4 mr-2" />
                        Continue
                    </Button>

                    {/* FOOTER */}
                    <p className="text-xs text-center text-gray-400">
                        Your session is secured with role-based authentication
                    </p>

                </Card>

            </div>

        </div>
    );
}