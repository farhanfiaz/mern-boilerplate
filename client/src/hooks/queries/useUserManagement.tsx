import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, deleteUser, getAllUserByTenant, updateRole } from "@/services/user-management.service";
import { User } from "@/types/user-management/user-management.types";
import { useToast } from "../use-toast";

export const useUserManagement = (page: number, limit: number, search: string, status: string, roleId: string) => {
    return useQuery({
        queryKey: ['users', page, limit, search, status, roleId],
        queryFn: () => getAllUserByTenant({ page, limit, search, status, roleId }),
    });
};

export const useCreateUser = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (user: User) => createUser(user),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast({
                title: "Success",
                description: "User created successfully",
                variant: "success",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to create user",
                variant: "destructive",
            });
        },
    });
};

export const useUpdateUser = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: User) => updateRole(user.id, user),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast({
                title: "Success",
                description: "User updated successfully",
                variant: "success",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to update user",
                variant: "destructive",
            });
        },
    });
};

export const useDeleteUser = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast({
                title: "Success",
                description: "User deleted successfully",
                variant: "success",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to delete user",
                variant: "destructive",
            });
        },
    });
};