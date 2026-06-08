import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import logger from "@/utils/logger";
import { useTenant } from "@/hooks/queries/useTenant";

export function Tenant() {
    const { user, updateTenant } = useAuth();
    const [currentTenant, setCurrentTenant] = useState(user?.user?.tenantId || "");

    useEffect(() => {
        if (user?.user?.tenantId) {
            setCurrentTenant(user.user.tenantId);
        }
    }, [user?.user?.tenantId]);

    logger.info("current tenant", currentTenant);

    const { data: tenant } = useTenant();

    const handleTenantChange = (value: string) => {
        logger.info("Tenant changed", value);
        setCurrentTenant(value);
        updateTenant(value);
    };

    return (
        <div className="inline-flex mt-1 ml-[48px] lg:ml-0">
            <Select value={currentTenant} onValueChange={handleTenantChange}>
                <SelectTrigger className="h-9 w-[180px] rounded-md border bg-white px-3 text-sm shadow-sm">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <SelectValue placeholder="Select company" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    {tenant && tenant.length > 0 ? (
                        tenant.map((t: { id: string, name: string }) => (
                            <SelectItem key={t.id} value={String(t.id)}>
                                <div className="flex items-center gap-2">
                                    <span>{t.name}</span>
                                </div>
                            </SelectItem>
                        ))
                    ) : (
                        <div className="p-2 text-xs text-muted-foreground text-center">No companies found</div>
                    )}
                </SelectContent>
            </Select>
        </div>
    );
}