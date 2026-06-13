import { useEffect, useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { getSelectedRole } from "@/utils/auth-storage";
import { allTenantRoles } from "@/services/role.service";
import { Role } from "@/types/auth.types";

/* ---------------- TYPES ---------------- */

type Menu = {
    id: string;
    name: string;
    parentId?: string | null;
    groupLabel?: string;
    icon?: string;
    url?: string;
    isAction: boolean;
    isActive: boolean;
};

/* ---------------- MOCK MENUS ---------------- */

const mockMenus: Menu[] = [
    {
        id: "1",
        name: "Dashboard",
        groupLabel: "Main",
        isAction: false,
        isActive: true,
    },
    {
        id: "2",
        name: "Users",
        groupLabel: "Main",
        isAction: false,
        isActive: true,
    },
    {
        id: "3",
        name: "Create User",
        parentId: "2",
        isAction: true,
        isActive: false,
    },
    {
        id: "4",
        name: "Edit User",
        parentId: "2",
        isAction: true,
        isActive: false,
    },
    {
        id: "5",
        name: "Settings",
        groupLabel: "System",
        isAction: false,
        isActive: true,
    },
];

export default function RoleAccess() {
    const { user } = useAuth();
    const [selectedRole, setSelectedRole] = useState(getSelectedRole() ?? '');
    const [search, setSearch] = useState("");
    const [roles, setRoles] = useState<Role[]>([]);

    const [menus, setMenus] = useState<Menu[]>(mockMenus);

    const fetchRoles = async () => {
        const res = await allTenantRoles(user?.user?.tenantId ?? '');
        setRoles(res);
    };

    useEffect(() => {
        fetchRoles();
    }, [selectedRole, user?.user?.tenantId]);

    /* ---------------- FILTER ---------------- */

    const filteredMenus = useMemo(() => {
        return menus.filter((m) =>
            m.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [menus, search]);

    /* ---------------- GROUP BY PARENT ---------------- */

    const grouped = useMemo(() => {
        const parents = filteredMenus.filter((m) => !m.parentId);
        const children = filteredMenus.filter((m) => m.parentId);

        return parents.map((p) => ({
            ...p,
            children: children.filter((c) => c.parentId === p.id),
        }));
    }, [filteredMenus]);

    /* ---------------- TOGGLE ---------------- */

    const toggleMenu = (id: string) => {
        setMenus((prev) =>
            prev.map((m) =>
                m.id === id ? { ...m, isActive: !m.isActive } : m
            )
        );
    };

    /* ---------------- UI ---------------- */

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between gap-3">

                {/* ROLE SELECT */}
                <div className="flex gap-3 items-center">
                    <span className="text-sm font-medium">Role:</span>

                    <select
                        className="border rounded-md px-3 py-2 bg-white"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                    >
                        {roles.map((r) => (
                            <option key={r.id} value={r.id}>
                                {r.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* SEARCH */}
                <Input
                    className="max-w-sm"
                    placeholder="Search menus..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>

            {/* SAVE BAR */}
            <div className="flex justify-end">
                <Button>Save Permissions</Button>
            </div>

            {/* MATRIX */}
            <Card className="bg-white border rounded-xl shadow overflow-hidden">

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Menu</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Access</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {grouped.map((parent) => (
                            <>
                                {/* PARENT ROW */}
                                <TableRow key={parent.id} className="bg-gray-50">

                                    <TableCell className="font-semibold">
                                        {parent.name}
                                    </TableCell>

                                    <TableCell>
                                        <Badge variant="secondary">
                                            {parent.groupLabel || "Menu"}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        <Switch
                                            checked={parent.isActive}
                                            onCheckedChange={() => toggleMenu(parent.id)}
                                        />
                                    </TableCell>

                                </TableRow>

                                {/* CHILDREN */}
                                {parent.children?.map((child) => (
                                    <TableRow key={child.id}>

                                        <TableCell className="pl-10">
                                            └ {child.name}
                                        </TableCell>

                                        <TableCell>
                                            {child.isAction ? (
                                                <Badge>Action</Badge>
                                            ) : (
                                                <Badge variant="outline">Menu</Badge>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <Switch
                                                checked={child.isActive}
                                                onCheckedChange={() => toggleMenu(child.id)}
                                            />
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </>
                        ))}
                    </TableBody>

                </Table>

            </Card>
        </div>
    );
}