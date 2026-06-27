import { ENDPOINTS } from "@/api/endpoints";
import { http } from "@/api/http";

export const emailValidate = async (email: string) => {
    const response = await http.post<any>(
        `${ENDPOINTS.AUTH.EMAILUNIQUEVALIDATE}`, {
        email
    }
    );
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
}
export const tenantNameValidate = async (name: string) => {
    const response = await http.post<any>(
        `${ENDPOINTS.AUTH.TENANTNAMEUNIQUEVALIDATE}`, {
        name
    }
    );
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
}
export const tenantSlugValidate = async (slug: string) => {
    const response = await http.post<any>(
        `${ENDPOINTS.AUTH.TENANTSLUGUNIQUEVALIDATE}`, {
        slug
    }
    );
    if (!response.success) {
        throw new Error(response.message);
    }
    return response.data;
}