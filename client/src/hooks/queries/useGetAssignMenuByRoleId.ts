import { useQuery } from "@tanstack/react-query";
import { getAllMenuByRoleId, getAllMenuByUserId } from "@/services/roleAccess.service";
import { queryKeys } from "@/constants/queryKeys";

export function useGetAssignMenuByRoleId(roleId: string) {
    return useQuery({
        queryKey: queryKeys.assignMenuByRoleById(roleId),
        queryFn: () => getAllMenuByRoleId(roleId),
        enabled: !!roleId
    });
}

export function useGetAssignMenuByUserId(userId: string) {
    return useQuery({
        queryKey: queryKeys.assignMenuByUserId(userId),
        queryFn: () => getAllMenuByUserId(userId),
        enabled: !!userId
    });
}