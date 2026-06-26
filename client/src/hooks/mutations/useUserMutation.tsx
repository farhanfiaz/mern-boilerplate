import { useMutation } from "@tanstack/react-query";
import { useToast } from "../use-toast";
import { changePasswordByUserId, resetPasswordByUserId } from "@/services/user.service";

export const useChangePasswordMutation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: changePasswordByUserId,

    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password changed successfully.",
      });
    },

    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useResetPasswordMutation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: resetPasswordByUserId,

    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password has been reset.",
      });
    },

    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};