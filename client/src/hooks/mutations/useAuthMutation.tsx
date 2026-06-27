import { emailValidate, tenantNameValidate, tenantSlugValidate } from "@/services/auth.service";
import logger from "@/utils/logger";
import { useMutation } from "@tanstack/react-query";


export function useEmailUniqueMutation() {

    return useMutation({
        mutationFn: (email: string) => emailValidate(email),
        onSuccess: () => {

        },
        onError: (error: any) => {
            logger.error(error);
        },
    });
}

export function useTenanNameUniqueMutation() {

    return useMutation({
        mutationFn: (name: string) => tenantNameValidate(name),
        onSuccess: () => {

        },
        onError: (error: any) => {
            logger.error(error);
        },
    });
}

export function useTenantSlugUniqueMutation() {

    return useMutation({
        mutationFn: (slug: string) => tenantSlugValidate(slug),
        onSuccess: () => {

        },
        onError: (error: any) => {
            logger.error(error);
        },
    });
}