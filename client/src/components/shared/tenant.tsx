import { useQuery } from "@tanstack/react-query";
import { getCurrentActiveTenant } from "@/services/menu.service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { Building2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import logger from "@/utils/logger";

export function Tenant() {
    const { user } = useAuth();
    const [currentTenant, setCurrentTenant] = useState(user?.user?.tenantId || "");
    logger.info("current tenant", currentTenant);
    const { data: tenant } = useQuery({
        queryKey: ["current-active-tenant"],
        queryFn: getCurrentActiveTenant,
    });
    const handleTenantChange = (value: string) => {
        logger.info("Tenant changed", value);
        setCurrentTenant(value);
    };
    return (
        <div className="inline-flex mt-1 ml-[48px] lg:ml-0">
            <Select value={currentTenant} onValueChange={handleTenantChange}>
                <SelectTrigger className="h-9 rounded-md border bg-white px-3 text-sm shadow-sm">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <SelectValue placeholder="Select company" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    {tenant?.length > 0 &&
                        tenant.map((t: { id: string, name: string }) => (
                            <SelectItem key={t.id} value={String(t.id)}>
                                <div className="flex items-center gap-2">
                                    <span>{t.name}</span>
                                </div>
                            </SelectItem>
                        ))}
                </SelectContent>
            </Select>
        </div>
    );
}