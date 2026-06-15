import { useQuery } from "@tanstack/react-query";
import { getAllMenuByRoleId } from "@/services/roleAccess.service";

export function useGetAssignMenuByRoleId(roleId: string) {
    return useQuery({
        queryKey: ["assign-menu-by-role-id", roleId],
        queryFn: () => getAllMenuByRoleId(roleId),
        enabled: !!roleId
    });
}