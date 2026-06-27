import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useTenant } from "@/hooks/queries/useTenant";
import React from "react";
import { getStoredAuth } from "@/utils/auth-storage";
import { useAppEvents } from "@/hooks/useAppEvents";
import { publishEvent } from "@/lib/appEvents";
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/utils/utils";
import logger from "@/utils/logger";

export function Tenant() {
    const { user, updateTenant } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const { data: tenantData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useTenant(searchTerm);

    const tenant = tenantData?.pages?.flatMap((page: any) => page.tenants) || [];
    const distinctTenants = tenant.filter(
        (tenant, index, arr) =>
            index === arr.findIndex((t) => t.id === tenant.id)
    );
    logger.info("Tenant data:", distinctTenants);
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
            <Select
                value={selectedCompanyId}
                onValueChange={(value) => {
                    setSelectedCompanyId(value);
                    handleChange(value);
                }}
            >
                <SelectTrigger>
                    <SelectValue placeholder="All Tenants" />
                </SelectTrigger>

                <SelectContent className="bg-background border shadow-md">
                    {/* SEARCH BOX */}
                    <div className="flex items-center border-b px-3 pb-2 pt-1.5">
                        <Search className="mr-2 h-4 w-4 opacity-50" />

                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search tenants..."
                            className="h-8 border-0 shadow-none focus-visible:ring-0"
                        />
                    </div>

                    {/* SCROLL CONTAINER (FIXED) */}
                    <div
                        className="max-h-60 overflow-y-auto"
                        onScroll={(e) => {
                            const el = e.currentTarget;

                            const isBottom =
                                el.scrollTop + el.clientHeight >= el.scrollHeight - 10;

                            if (isBottom && hasNextPage && !isFetchingNextPage) {
                                fetchNextPage();
                            }
                        }}
                    >

                        {/* LOADING FIRST TIME */}
                        {isLoading && (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                                Loading...
                            </div>
                        )}

                        {/* Tenant LIST */}
                        {distinctTenants.map((tenant: any) => (
                            <SelectItem
                                key={tenant.id}
                                value={tenant.id}
                                className="py-2"
                            >
                                <div className="flex items-center gap-3 w-full">
                                    {/* Avatar */}
                                    <span className="shrink-0">
                                        <Avatar className="h-9 w-9 rounded-full ring-2 ring-violet-200 shadow-sm">
                                            <AvatarImage
                                                loading="lazy"
                                                src={
                                                    tenant?.logo
                                                        ? tenant.logo
                                                        : `/api/users/${tenant.id}/photo`
                                                }
                                                alt={tenant.name || "Tenant"}
                                                onError={(e) => {
                                                    e.currentTarget.src = "";
                                                }}
                                            />

                                            <AvatarFallback className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-xs font-semibold">
                                                {getInitials(tenant.name || "", "")}
                                            </AvatarFallback>
                                        </Avatar>
                                    </span>
                                    <span className="font-medium">
                                        {tenant.name}
                                    </span>

                                </div>
                            </SelectItem>
                        ))}

                        {/* LOAD MORE */}
                        {isFetchingNextPage && (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                                Loading more...
                            </div>
                        )}

                        {/* END STATE */}
                        {!hasNextPage && distinctTenants.length > 0 && (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                                No more tenants
                            </div>
                        )}

                        {/* EMPTY STATE */}
                        {!isLoading && distinctTenants.length === 0 && (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                                No tenants found
                            </div>
                        )}
                    </div>
                </SelectContent>
            </Select>
        </div>
    );
}