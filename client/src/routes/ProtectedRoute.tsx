import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { useMenu } from "@/hooks/queries/useMenu";
import { useLocation } from "wouter";
import logger from "@/utils/logger";

interface Props {
    children: ReactNode;
    menuByPass?: boolean;
}

export default function ProtectedRoute({ children, menuByPass = false }: Props) {
    const { user } = useAuth();
    const [location] = useLocation();
    const { data, isLoading, error } = useMenu();

    if (!user) {
        return <Navigate to="/login" replace />;
    }
    if (menuByPass) {
        return <>{children}</>;
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
    logger.info("menu", data?.menus);
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