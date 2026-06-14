import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { createTenant as createTenantService, deleteTenant, editTenant, inActiveTenant } from "@/services/tenant.service";
import { queryKeys, TENANT_SCOPED_QUERY_KEY } from "@/constants/queryKeys";

export const useCreateTenant = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        mutationFn: ({ name, slug, description, website, logo }: { name: string, slug: string, description: string, website: string, logo: string }) => createTenantService(name, slug, description, website, logo),
        onSuccess: () => {
            toast({
                title: "Success",
                variant: "success",
                description: "Tenant created successfully"
            });
        },
        onError: () => {
            toast({
                title: "Error",
                variant: "destructive",
                description: "Failed to create tenant"
            });
        },
    });
}

export const useEditTenant = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        mutationFn: ({ id, name, slug, description, website, logo }: { id: string, name: string, slug: string, description: string, website: string, logo: string }) => editTenant(id, name, slug, description, website, logo),
        onSuccess: () => {
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
        onSuccess: () => {
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
        onSuccess: () => {
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