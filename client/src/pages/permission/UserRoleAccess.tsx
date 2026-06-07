import { useMemo, useState } from "react";

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

/* ---------------- TYPES ---------------- */

type Menu = {
    id: string;
    name: string;
    parentId?: string | null;
    groupLabel?: string;
    isAction: boolean;
    isActive: boolean;
};

/* ---------------- MOCK DATA ---------------- */

const mockUsers = [
    { id: "u1", name: "John Admin" },
    { id: "u2", name: "Sarah User" },
    { id: "u3", name: "Mike Moderator" },
];

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

export default function UserRoleAccess() {
    const [selectedUser, setSelectedUser] = useState("u1");
    const [search, setSearch] = useState("");

    const [menus, setMenus] = useState<Menu[]>(mockMenus);

    /* ---------------- FILTER ---------------- */

    const filteredMenus = useMemo(() => {
        return menus.filter((m) =>
            m.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [menus, search]);

    /* ---------------- GROUPING ---------------- */

    const grouped = useMemo(() => {
        const parents = filteredMenus.filter((m) => !m.parentId);
        const children = filteredMenus.filter((m) => m.parentId);

        return parents.map((p) => ({
            ...p,
            children: children.filter((c) => c.parentId === p.id),
        }));
    }, [filteredMenus]);

    /* ---------------- TOGGLE ACCESS ---------------- */

    const toggleAccess = (id: string) => {
        setMenus((prev) =>
            prev.map((m) =>
                m.id === id ? { ...m, isActive: !m.isActive } : m
            )
        );
    };

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between gap-3">

                {/* USER SELECT */}
                <div className="flex gap-3 items-center">
                    <span className="text-sm font-medium">User:</span>

                    <select
                        className="border rounded-md px-3 py-2 bg-white"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                    >
                        {mockUsers.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* SEARCH */}
                <Input
                    className="max-w-sm"
                    placeholder="Search permissions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* SAVE */}
            <div className="flex justify-end">
                <Button>Save User Access</Button>
            </div>

            {/* TABLE */}
            <Card className="bg-white border rounded-xl shadow overflow-hidden">

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Permission</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Access</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {grouped.map((parent) => (
                            <>
                                {/* PARENT */}
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
                                            onCheckedChange={() => toggleAccess(parent.id)}
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
                                                onCheckedChange={() => toggleAccess(child.id)}
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