import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getCurrentActiveTenant } from "@/services/menu.service";

export const useTenant = () => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ["current-active-tenant"],
        queryFn: getCurrentActiveTenant,
        enabled: !!user?.user?.tenantId,
    });
};