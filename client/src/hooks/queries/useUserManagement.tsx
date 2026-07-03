import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, deleteUser, getAllUserByTenant, getAllUserWithPagination, getUserById, updateRole, uploadUserPhoto } from "@/services/user-management.service";
import { User } from "@/types/user-management/user-management.types";
import { useToast } from "../use-toast";
import logger from "@/utils/logger";

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
        onError: (err: any) => {

            if (!err?.response?.data?.success) {
                toast({
                    title: "Error",
                    description: err?.response?.data?.message || "Failed to create user",
                    variant: "destructive",
                });
            }
            logger.error(err);
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

export const useUserByTenant = (search: any) => {
    return useInfiniteQuery({
        queryKey: ["users-pagination-new", search],
        queryFn: ({ pageParam = 1 }) => getAllUserWithPagination({ page: pageParam, limit: 10, search: search }),
        getNextPageParam: (lastPage) => {
            return lastPage.pagination.hasNextPage ? lastPage.pagination.nextPage : undefined;
        },
        initialPageParam: 1
    });
};

export const useGetUserById = (id: string) => {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => getUserById(id),
        enabled: !!id,
    });
}

export const useUploadUserPhoto = () => {
    const { toast } = useToast();
    return useMutation({
        mutationFn: (data: { id: string; file: File }) => {
            return uploadUserPhoto(data.id, data.file);
        },
        onSuccess: (data: any) => {
            toast({
                title: "Success",
                description: "User photo uploaded successfully",
                variant: "success",
            });
        },
        onError: (err: any) => {
            logger.error(err);
            if (!err?.response?.data?.success) {
                toast({
                    title: "Error",
                    description: err?.response?.data?.message || "Failed to create user",
                    variant: "destructive",
                });
            }
        }
    });
}