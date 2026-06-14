import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useTenant } from "@/hooks/queries/useTenant";
import React from "react";
import { getStoredAuth } from "@/utils/auth-storage";
import { useAppEvents } from "@/hooks/useAppEvents";
import { publishEvent } from "@/lib/appEvents";

export function Tenant() {
    const { user, updateTenant } = useAuth();
    const { data: tenant } = useTenant();

    const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
        user?.user?.tenantId || ""
    );

    useEffect(() => {
        (async () => {
            const authUser = await getStoredAuth();
            setSelectedCompanyId(authUser?.user?.tenantId || "");
        })();
    }, []);

    useAppEvents((event) => {
        if (event.type === "COMPANY_CHANGED") {
            const id = event.companyId;
            setSelectedCompanyId(id);
        }
    });

    const handleChange = async (value: string) => {
        await updateTenant(value);
        setSelectedCompanyId(value);
        publishEvent({
            type: "COMPANY_CHANGED",
            companyId: value,
        });
    };

    return (
        <div className="inline-flex mt-1 ml-[48px] lg:ml-0">
            <Select value={selectedCompanyId} onValueChange={handleChange}>
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