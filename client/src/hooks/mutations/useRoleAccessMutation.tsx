import { useToast } from "@/hooks/use-toast";
import { saveRoleAccess, saveUserRoleAccess } from "@/services/roleAccess.service";
import { useMutation } from "@tanstack/react-query";


export function useCreateMutationRoleAccess() {
    const { toast } = useToast();
    return useMutation({
        mutationFn: (data: any) => saveRoleAccess(data),
        onSuccess: () => {
            toast({
                title: "Role Access created",
                description: "The role access has been created successfully.",
                variant: "default",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response.data.message,
                variant: "destructive",
            });
        },
    });
}

export function useCreateMutationUserRoleAccess() {
    const { toast } = useToast();
    return useMutation({
        mutationFn: (data: any) => saveUserRoleAccess(data),
        onSuccess: () => {
            toast({
                title: "User Access created",
                description: "The user access has been created successfully.",
                variant: "default",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response.data.message,
                variant: "destructive",
            });
        },
    });
}