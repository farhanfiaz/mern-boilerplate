import { useEffect, useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";

import { useCreateMutationUserRoleAccess } from "@/hooks/mutations/useRoleAccessMutation";
import { useMenu } from "@/hooks/queries/useMenu";
import { useGetAssignMenuByUserId } from "@/hooks/queries/useGetAssignMenuByRoleId";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserByTenant } from "@/hooks/queries/useUserManagement";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/utils";

export default function UserRoleAccess() {
    const [selectedUser, setSelectedUserId] = useState("");
    const [selectedParent, setSelectedParent] = useState("");
    const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const { mutate: createUserRoleAccess, isPending } =
        useCreateMutationUserRoleAccess();

    const { data: menusData } = useMenu();
    const { data: userData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useUserByTenant(searchTerm);

    const { data: assignMenuByUserId } =
        useGetAssignMenuByUserId(selectedUser);

    const users = userData?.pages?.flatMap((page: any) => page.users) || [];
    const menus = menusData?.menus || [];

    // ✅ RESET EVERYTHING WHEN ROLE CHANGES
    useEffect(() => {
        setSelectedMenus([]);
        setSelectedParent("");
    }, [selectedUser]);

    // ✅ SYNC SELECTED MENUS AFTER API LOAD
    useEffect(() => {
        const menuIds = assignMenuByUserId?.menuIds;

        if (Array.isArray(menuIds)) {
            setSelectedMenus(menuIds);
        }
    }, [assignMenuByUserId?.menuIds]);

    // ✅ PARENT MENUS
    const parentMenus = useMemo(() => {
        return menus.filter((m: any) => !m.parentId);
    }, [menus]);

    // ✅ AUTO SET FIRST PARENT
    useEffect(() => {
        if (!selectedParent && parentMenus.length > 0) {
            setSelectedParent(parentMenus[0].id);
        }
    }, [parentMenus, selectedParent]);

    // ✅ CHILD MENUS (SAFE)
    const childMenus = useMemo(() => {
        if (!selectedParent) return [];

        return menus.filter(
            (m: any) =>
                m.parentId === selectedParent &&
                m.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [menus, selectedParent, search]);

    const getChildren = (parentId: string) =>
        menus.filter((m: any) => m.parentId === parentId);

    const toggleChild = (id: string) => {
        setSelectedMenus((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        );
    };

    const toggleParent = (parentId: string) => {
        const children = getChildren(parentId);

        if (children.length === 0) {
            setSelectedMenus((prev) =>
                prev.includes(parentId)
                    ? prev.filter((id) => id !== parentId)
                    : [...prev, parentId]
            );
            return;
        }

        const allSelected = children.every((c: any) =>
            selectedMenus.includes(c.id)
        );

        if (allSelected) {
            setSelectedMenus((prev) =>
                prev.filter(
                    (id) => !children.some((c: any) => c.id === id)
                )
            );
        } else {
            setSelectedMenus((prev) => [
                ...new Set([
                    ...prev,
                    ...children.map((c: any) => c.id),
                ]),
            ]);
        }
    };

    const isParentSelected = (parentId: string) => {
        const children = getChildren(parentId);

        if (children.length === 0) {
            return selectedMenus.includes(parentId);
        }

        return children.every((c: any) =>
            selectedMenus.includes(c.id)
        );
    };

    const allSelected =
        childMenus.length > 0 &&
        childMenus.every((m: any) =>
            selectedMenus.includes(m.id)
        );

    const handleSelectAll = () => {
        if (allSelected) {
            setSelectedMenus((prev) =>
                prev.filter(
                    (id) =>
                        !childMenus.some((m: any) => m.id === id)
                )
            );
        } else {
            setSelectedMenus((prev) => [
                ...new Set([
                    ...prev,
                    ...childMenus.map((m: any) => m.id),
                ]),
            ]);
        }
    };

    const handleSave = () => {
        if (!selectedUser) return;

        createUserRoleAccess({
            userId: selectedUser,
            menuIds: selectedMenus,
        });
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen space-y-6">

            {/* HEADER */}
            <div className="flex gap-3 justify-between">
                <div className="relative w-full md:max-w-sm">
                    <Select
                        value={selectedUser}
                        onValueChange={setSelectedUserId}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All users" />
                        </SelectTrigger>

                        <SelectContent className="bg-background border shadow-md w-[300px]">
                            {/* SEARCH BOX */}
                            <div className="flex items-center border-b px-3 pb-2 pt-1.5">
                                <Search className="mr-2 h-4 w-4 opacity-50" />

                                <Input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search users..."
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
                                {users.map((user: any) => (
                                    <SelectItem
                                        key={user.id}
                                        value={user.id}
                                        className="py-2"
                                    >
                                        <div className="flex items-center gap-3 w-full">

                                            {/* Avatar */}
                                            <span className="shrink-0">
                                                <Avatar className="h-9 w-9 rounded-full ring-2 ring-violet-200 shadow-sm">
                                                    <AvatarImage
                                                        loading="lazy"
                                                        src={
                                                            user?.avatarUrl
                                                                ? user.avatarUrl
                                                                : `/api/users/${user?.id}/photo`
                                                        }
                                                        alt={user.email || "user"}
                                                        onError={(e) => {
                                                            e.currentTarget.src = "";
                                                        }}
                                                    />

                                                    <AvatarFallback className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-xs font-semibold">
                                                        {getInitials(user.firstName || "", user.lastName || "")}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </span>

                                            {/* User Info */}
                                            <div className="flex flex-col leading-tight">
                                                <span className="font-medium text-sm text-foreground">
                                                    {user.firstName} {user.lastName}
                                                </span>

                                                <span className="text-xs text-muted-foreground">
                                                    {user.email}
                                                </span>
                                            </div>

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
                                {!hasNextPage && users.length > 0 && (
                                    <div className="px-3 py-2 text-sm text-muted-foreground">
                                        No more users
                                    </div>
                                )}

                                {/* EMPTY STATE */}
                                {!isLoading && users.length === 0 && (
                                    <div className="px-3 py-2 text-sm text-muted-foreground">
                                        No users found
                                    </div>
                                )}
                            </div>
                        </SelectContent>
                    </Select>
                </div>

                <Input
                    className="max-w-sm bg-white"
                    placeholder="Search child menus..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* SAVE */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={isPending}
                >
                    {isPending ? "Saving..." : "Save Permissions"}
                </Button>
            </div>

            {/* MAIN */}
            <Card className="p-5">
                <div className="grid grid-cols-12 gap-6">

                    {/* LEFT */}
                    <div className="col-span-12 lg:col-span-3">
                        <div className="text-sm font-semibold mb-2">
                            Parent Menus
                        </div>

                        {parentMenus.map((menu: any) => (
                            <div
                                key={menu.id}
                                onClick={() =>
                                    setSelectedParent(menu.id)
                                }
                                className={`p-3 border rounded cursor-pointer mb-2 ${selectedParent === menu.id
                                    ? "bg-blue-50 border-blue-400"
                                    : "bg-white"
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={isParentSelected(menu.id)}
                                    onChange={() =>
                                        toggleParent(menu.id)
                                    }
                                />
                                <span className="ml-2">
                                    {menu.name}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT */}
                    <div className="col-span-12 lg:col-span-9">

                        <div className="flex justify-between mb-3">
                            <div className="font-semibold">
                                Child Menus
                            </div>

                            {childMenus.length > 0 && (
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={handleSelectAll}
                                    />{" "}
                                    Select All
                                </label>
                            )}
                        </div>

                        {childMenus.length === 0 ? (
                            <div className="p-6 text-gray-400">
                                No child menus
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-3">
                                {childMenus.map((menu: any) => (
                                    <label
                                        key={menu.id}
                                        className="p-3 border rounded flex gap-2"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedMenus.includes(
                                                menu.id
                                            )}
                                            onChange={() =>
                                                toggleChild(menu.id)
                                            }
                                        />
                                        {menu.name}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}