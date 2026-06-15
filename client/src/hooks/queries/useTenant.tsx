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
        enabled: !!tenantId,
    });
};

export const useAllTenants = (page: number, pageSize: number, search: string) => {
    return useQuery({
        queryKey: queryKeys.allTenants(page, pageSize, search),
        queryFn: () => getAllTenants(page, pageSize, search),

        staleTime: 1000 * 30,
        gcTime: 1000 * 60,

        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
};