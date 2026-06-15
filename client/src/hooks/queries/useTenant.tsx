import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getCurrentActiveTenant } from "@/services/menu.service";
import { queryKeys } from "@/constants/queryKeys";
import { getAllTenants } from "@/services/tenant.service";

export const useTenant = () => {
    const { user } = useAuth();
    const tenantId = user?.user?.tenantId ?? "";

    return useQuery({
        queryKey: queryKeys.currentActiveTenant(tenantId),
        queryFn: getCurrentActiveTenant,
        enabled: !!user?.user?.userId
    });
};

export const useAllTenants = (page: number, pageSize: number, search: string) => {
    const { user } = useAuth();
    return useQuery({
        queryKey: queryKeys.allTenants(page, pageSize, search),
        queryFn: () => getAllTenants(page, pageSize, search),
        enabled: !!user?.user?.userId
    });
};