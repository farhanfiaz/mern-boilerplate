import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { createTenant as createTenantService, deleteTenant, editTenant, inActiveTenant } from "@/services/tenant.service";
import { ALL_TENANTS_QUERY_KEY, queryKeys, TENANT_SCOPED_QUERY_KEY } from "@/constants/queryKeys";

export const useCreateTenant = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        onMutate: async (newTenant: { name: string, slug: string, description: string, website: string, logo: string }) => {
            queryClient.cancelQueries({ queryKey: [ALL_TENANTS_QUERY_KEY] });
            const previousData = queryClient.getQueryData([ALL_TENANTS_QUERY_KEY]);
            queryClient.setQueryData([ALL_TENANTS_QUERY_KEY], (old: any) => {
                return [...old, newTenant];
            });
            return { previousData };
        },
        mutationFn: (newTenant: { name: string, slug: string, description: string, website: string, logo: string }) => createTenantService(newTenant.name, newTenant.slug, newTenant.description, newTenant.website, newTenant.logo),
        onSuccess: async () => {
            toast({
                title: "Success",
                variant: "success",
                description: "Tenant created successfully"
            });
        },
        onError: (error: Error, newTenant: { name: string, slug: string, description: string, website: string, logo: string }, context: { previousData: any } | undefined) => {
            queryClient.setQueryData([ALL_TENANTS_QUERY_KEY], context?.previousData);
            toast({
                title: "Error",
                variant: "destructive",
                description: "Failed to create tenant"
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: [ALL_TENANTS_QUERY_KEY],
              });
        },
    });
}

export const useEditTenant = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        mutationFn: ({ id, name, slug, description, website, logo }: { id: string, name: string, slug: string, description: string, website: string, logo: string }) => editTenant(id, name, slug, description, website, logo),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [ALL_TENANTS_QUERY_KEY],
              });
            toast({
                title: "Success",
                variant: "success",
                description: "Tenant updated successfully"
            });
        },
        onError: () => {
            toast({
                title: "Error",
                variant: "destructive",
                description: "Failed to update tenant"
            });
        },
    });
}

export const useDeleteTenant = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        mutationFn: (id: string) => deleteTenant(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [ALL_TENANTS_QUERY_KEY],
              });
            toast({
                title: "Success",
                variant: "success",
                description: "Tenant deleted successfully"
            });
        },
        onError: () => {
            toast({
                title: "Error",
                variant: "destructive",
                description: "Failed to delete tenant"
            });
        },
    });
}

export const useInActivateTenant = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        mutationFn: (id: string) => inActiveTenant(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [ALL_TENANTS_QUERY_KEY],
              });
            toast({
                title: "Success",
                variant: "success",
                description: "Tenant deactivated successfully"
            });
        },
        onError: () => {
            toast({
                title: "Error",
                variant: "destructive",
                description: "Failed to deactivate tenant"
            });
        },
    });
}