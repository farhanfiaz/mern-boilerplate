import { useQuery } from "@tanstack/react-query";
import { getAllMenuByRoleId } from "@/services/roleAccess.service";
import { queryKeys } from "@/constants/queryKeys";

export function useGetAssignMenuByRoleId(roleId: string) {
    return useQuery({
        queryKey: queryKeys.assignMenuByRoleById(roleId),
        queryFn: () => getAllMenuByRoleId(roleId),
        enabled: !!roleId
    });
}