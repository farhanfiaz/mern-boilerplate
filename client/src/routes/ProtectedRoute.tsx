import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { useMenu } from "@/hooks/queries/useMenu";
import { useLocation } from "wouter";

interface Props {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
    const { user } = useAuth();
    const [location] = useLocation();
    const { data, isLoading, error } = useMenu();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
            </div>
        </div>
    }
    if (error) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong!</h2>
            </div>
        </div>
    }

    if (data?.menus && data?.menus?.some((item: any) => item.url === location)) {
        return <>{children}</>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                <p className="text-gray-600">You do not have permission to access this section.</p>
            </div>
        </div>
    );
}