import { useEffect, useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";

import { useCreateMutationRoleAccess } from "@/hooks/mutations/useRoleAccessMutation";
import { useMenu } from "@/hooks/queries/useMenu";
import { useRole } from "@/hooks/queries/useRole";
import { useGetAssignMenuByRoleId } from "@/hooks/queries/useGetAssignMenuByRoleId";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function UserRoleAccess() {
    const [selectedUser, setSelectedUserId] = useState("");
    const [selectedParent, setSelectedParent] = useState("");
    const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
    const [search, setSearch] = useState("");

    const { mutate: createRoleAccess, isPending } =
        useCreateMutationRoleAccess();

    const { data: menusData } = useMenu();
    const { data: userData } = useRole();

    const { data: assignMenuByRoleId } =
        useGetAssignMenuByRoleId(selectedUser);

    const roles = userData?.data || [];
    const menus = menusData?.menus || [];

    // ✅ RESET EVERYTHING WHEN ROLE CHANGES
    useEffect(() => {
        setSelectedMenus([]);
        setSelectedParent("");
    }, [selectedUser]);

    // ✅ SYNC SELECTED MENUS AFTER API LOAD
    useEffect(() => {
        const menuIds = assignMenuByRoleId?.menuIds;

        if (Array.isArray(menuIds)) {
            setSelectedMenus(menuIds);
        }
    }, [assignMenuByRoleId?.menuIds]);

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

        createRoleAccess({
            roleId: selectedUser,
            menuIds: selectedMenus,
        });
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen space-y-6">

            {/* HEADER */}
            <div className="flex gap-3 justify-between">
                <Select
                    value={selectedUser}
                    onValueChange={setSelectedUserId}
                >
                    <SelectTrigger className="w-[240px] bg-white">
                        <SelectValue placeholder="Select User" />
                    </SelectTrigger>
                    <SelectContent>
                        {roles.map((r: any) => (
                            <SelectItem key={r.id} value={r.id}>
                                {r.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

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