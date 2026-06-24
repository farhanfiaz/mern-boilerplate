import { useAuth } from "@/context/AuthContext";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getCurrentActiveTenant, getCurrentActiveTenantWIthPagination } from "@/services/menu.service";
import { queryKeys } from "@/constants/queryKeys";
import { getAllTenants } from "@/services/tenant.service";

export const useTenant = (search:any) => {
    const { user } = useAuth();
    const tenantId = user?.user?.tenantId ?? "";
    // return useQuery({
    //     queryKey: queryKeys.currentActiveTenant(tenantId),
    //     queryFn: getCurrentActiveTenant,
    //     enabled: !!user?.user?.userId
    // });
    return useInfiniteQuery({
        queryKey: ["tenant-pagination-new", search],
        queryFn: ({ pageParam = 1 }) => getCurrentActiveTenantWIthPagination({ page: pageParam, limit: 10, search: search }),
        getNextPageParam: (lastPage) => {
            return lastPage.pagination.hasNextPage ? lastPage.pagination.nextPage : undefined;
        },
        initialPageParam: 1
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