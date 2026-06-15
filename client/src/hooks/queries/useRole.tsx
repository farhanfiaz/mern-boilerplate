import { createRole, deleteRole, getAllRoles, inActiveRole, updateRole } from "@/services/role.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../use-toast";
import { Role } from "@/types/role/role.types";

export const useRole = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['roles'],
        queryFn: () => getAllRoles(),
    });
    return { data, isLoading, error };
}

export const useCreateMutationRole = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (role: Role) => createRole(role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            toast({
                title: "Success",
                variant: "success",
                description: "Role created successfully"
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                variant: "destructive",
                description: error.message ?? "Failed to create role"
            });
        },
    });
};

export const useUpdateMutationRole = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (role: Role) => updateRole(role.id, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            toast({
                title: "Success",
                variant: "success",
                description: "Role updated successfully"
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                variant: "destructive",
                description: error.message ?? "Failed to update role"
            });
        },
    });
};

export const useDeleteMutationRole = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteRole(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            toast({
                title: "Success",
                variant: "success",
                description: "Role deleted successfully"
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                variant: "destructive",
                description: error.message ?? "Failed to delete role"
            });
        },
    });
};

export const useInActiveMutationRole = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => inActiveRole(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            toast({
                title: "Success",
                variant: "success",
                description: "Role inactivated successfully"
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                variant: "destructive",
                description: error.message ?? "Failed to inactivate role"
            });
        },
    });
};  
