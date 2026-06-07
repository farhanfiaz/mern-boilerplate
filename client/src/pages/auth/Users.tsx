"use client";

import { useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/utils";

/* ---------------- TYPE ---------------- */

type User = {
    id: string;
    image: string;
    firstName: string;
    lastName: string;
    email: string;
    username?: string;
    phone?: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
};

/* ---------------- MOCK DATA ---------------- */

const initialUsers: User[] = [
    {
        id: "1",
        image: "https://avatar.iran.liara.run/public/boy?username=JohnDoe",
        firstName: "John",
        lastName: "Admin",
        email: "john@demo.com",
        username: "john.admin",
        phone: "+92 300 000000",
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
    },
    {
        id: "2",
        image: "https://avatar.iran.liara.run/public/girl?username=SarahKhan",
        firstName: "Sarah",
        lastName: "Khan",
        email: "sarah@demo.com",
        username: "sarah.khan",
        phone: "",
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
    },
];

export default function Users() {
    const [users, setUsers] = useState<User[]>(initialUsers);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 5;

    /* ---------------- MODAL STATES ---------------- */

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [deleteId, setDeleteId] = useState<string | null>(null);

    /* ---------------- FORM ---------------- */

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        phone: "",
    });

    /* ---------------- FILTER ---------------- */

    const filtered = useMemo(() => {
        return users.filter((u) => {
            const text =
                `${u.firstName} ${u.lastName} ${u.email} ${u.username}`
                    .toLowerCase();

            return text.includes(search.toLowerCase()) && !u.isDeleted;
        });
    }, [users, search]);

    /* ---------------- PAGINATION ---------------- */

    const paginated = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, page]);

    const totalPages = Math.ceil(filtered.length / pageSize);

    /* ---------------- ADD ---------------- */

    const handleAdd = () => {
        setEditing(false);
        setEditingId(null);

        setForm({
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            phone: "",
        });

        setOpen(true);
    };

    /* ---------------- EDIT ---------------- */

    const handleEdit = (user: User) => {
        setEditing(true);
        setEditingId(user.id);

        setForm({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username || "",
            phone: user.phone || "",
        });

        setOpen(true);
    };

    /* ---------------- SAVE ---------------- */

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editing && editingId) {
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === editingId ? { ...u, ...form } : u
                )
            );
        } else {
            setUsers((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    ...form,
                    image: `https://avatar.iran.liara.run/public/boy?username=${form.firstName}`,
                    isActive: true,
                    isDeleted: false,
                    createdAt: new Date().toISOString(),
                },
            ]);
        }

        setOpen(false);
    };

    /* ---------------- DELETE ---------------- */

    const handleDelete = () => {
        if (!deleteId) return;

        setUsers((prev) =>
            prev.map((u) =>
                u.id === deleteId ? { ...u, isDeleted: true } : u
            )
        );

        setDeleteId(null);
    };

    /* ---------------- UI ---------------- */

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between gap-3">

                <div className="relative w-full md:max-w-sm">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />

                    <Input
                        className="pl-9"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <Button onClick={handleAdd}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                </Button>

            </div>

            {/* TABLE */}
            <Card className="bg-white border rounded-xl shadow overflow-hidden">

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {paginated.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Avatar className="h-10 w-10 shrink-0 rounded-full ring-2 ring-violet-300/50">
                                        <AvatarImage
                                            src={user.image}
                                            alt={user?.firstName + " " + user?.lastName || "Profile"}
                                        />
                                        <AvatarFallback>
                                            {getInitials(user?.firstName, user?.lastName)}
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>

                                <TableCell>
                                    {user.firstName} {user.lastName}
                                </TableCell>

                                <TableCell>{user.email}</TableCell>

                                <TableCell>{user.username || "-"}</TableCell>

                                <TableCell>
                                    <Badge>Active</Badge>
                                </TableCell>

                                <TableCell className="text-right space-x-2">

                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => handleEdit(user)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        size="icon"
                                        variant="destructive"
                                        onClick={() => setDeleteId(user.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>

                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </Card>

            {/* PAGINATION */}
            <div className="flex justify-between">
                <p className="text-sm text-gray-500">
                    Page {page} of {totalPages || 1}
                </p>
            </div>

            {/* ---------------- ADD / EDIT MODAL ---------------- */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editing ? "Edit User" : "Add User"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-3">

                        <Input
                            placeholder="First Name"
                            value={form.firstName}
                            onChange={(e) =>
                                setForm({ ...form, firstName: e.target.value })
                            }
                        />

                        <Input
                            placeholder="Last Name"
                            value={form.lastName}
                            onChange={(e) =>
                                setForm({ ...form, lastName: e.target.value })
                            }
                        />

                        <Input
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                        />

                        <Input
                            placeholder="Username"
                            value={form.username}
                            onChange={(e) =>
                                setForm({ ...form, username: e.target.value })
                            }
                        />

                        <Input
                            placeholder="Phone"
                            value={form.phone}
                            onChange={(e) =>
                                setForm({ ...form, phone: e.target.value })
                            }
                        />

                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>

                            <Button type="submit">
                                {editing ? "Update" : "Create"}
                            </Button>
                        </div>

                    </form>

                </DialogContent>
            </Dialog>

            {/* ---------------- DELETE WARNING ---------------- */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>

                <AlertDialogContent>

                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete User
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This action will soft-delete this user.
                            They will no longer appear in the system.
                        </AlertDialogDescription>

                    </AlertDialogHeader>

                    <AlertDialogFooter>

                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>

                    </AlertDialogFooter>

                </AlertDialogContent>

            </AlertDialog>

        </div>
    );
}