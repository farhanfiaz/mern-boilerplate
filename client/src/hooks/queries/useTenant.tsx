import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getCurrentActiveTenant } from "@/services/menu.service";
import { queryKeys } from "@/constants/queryKeys";

export const useTenant = () => {
    const { user } = useAuth();
    const tenantId = user?.user?.tenantId ?? "";

    return useQuery({
        queryKey: queryKeys.currentActiveTenant(tenantId),
        queryFn: getCurrentActiveTenant,
        enabled: !!tenantId,
    });
};