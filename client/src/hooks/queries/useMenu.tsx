import { useQuery } from "@tanstack/react-query";
import { getUserMenus } from "@/services/menu.service";
import { useAuth } from "@/context/AuthContext";
import { getSelectedRole } from "@/utils/auth-storage";
import logger from "@/utils/logger";
import { queryKeys } from "@/constants/queryKeys";

export const useMenu = () => {
    const { user } = useAuth();
    const userId = user?.user.userId || "";
    const tenantId = user?.user?.tenantId || "";
    const roleId = getSelectedRole() || "";
    logger.info("logged IN User: ", {
        userId,
        roleId,
        tenantId,
    });
    return useQuery({
        queryKey: queryKeys.userMenu(tenantId, userId, roleId),
        queryFn: () => getUserMenus(userId, roleId),
        enabled: !!user && !!roleId && !!tenantId
    });
}