import { useQuery } from "@tanstack/react-query";
import { getUserMenus } from "@/services/menu.service";
import { useAuth } from "@/context/AuthContext";
import { getSelectedRole } from "@/utils/auth-storage";

export const useMenu = () => {
    const { user } = useAuth();
    const userId = user?.user.userId || "";
    const roleId = getSelectedRole() || "";
    return useQuery({
        queryKey: ['user-menu'],
        queryFn: () => getUserMenus(userId, roleId),
        enabled: !!user && !!roleId
    });
}