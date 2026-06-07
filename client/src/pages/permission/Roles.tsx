import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Role, AllRoles } from "@/types/role/role.types";

import {
    getAllRoles,
    createRole,
    updateRole,
    deleteRole,
    inActiveRole,
} from "@/services/role.service";

import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Roles() {

    const { toast } = useToast();

    /* ---------------- STATE ---------------- */
    const [data, setData] = useState<AllRoles | null>(null);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const roles = data?.data ?? [];
    const pagination = data?.pagination;

    /* ---------------- MODAL ---------------- */
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    /* ---------------- FORM ---------------- */
    const [form, setForm] = useState({
        name: "",
        description: "",
    });

    /* ---------------- FETCH ---------------- */
    const fetchRoles = async () => {
        const res = await getAllRoles();
        setData(res);
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    /* ---------------- FILTER + PAGINATION (LOCAL UI ONLY) ---------------- */
    const filtered = roles.filter((r) =>
        `${r.name} ${r.description}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const paginated = filtered.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const totalPages = Math.ceil(filtered.length / pageSize);

    /* ---------------- ADD ---------------- */
    const handleAdd = () => {
        setEditing(false);
        setEditingId(null);
        setForm({ name: "", description: "" });
        setOpen(true);
    };

    /* ---------------- EDIT ---------------- */
    const handleEdit = (role: Role) => {
        setEditing(true);
        setEditingId(role.id);

        setForm({
            name: role.name,
            description: role.description || "",
        });

        setOpen(true);
    };

    /* ---------------- SAVE (CREATE / UPDATE) ---------------- */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editing && editingId) {
                await updateRole(editingId, {
                    ...roles.find((r) => r.id === editingId)!,
                    name: form.name,
                    description: form.description,
                });
                toast({
                    title: "Role updated",
                    variant: "success",
                });
            } else {
                await createRole({
                    id: "",
                    name: form.name,
                    description: form.description,
                    isSystem: false,
                    createdAt: new Date().toISOString(),
                });
                toast({
                    title: "Role created",
                    variant: "success",
                });
            }

            setOpen(false);
            await fetchRoles();
        } catch (err) {
            console.error(err);
            toast({
                title: "Role create/update failed",
                variant: "destructive",
            });
        }
    };

    /* ---------------- DELETE ---------------- */
    const handleDelete = async (id: string) => {
        try {
            await deleteRole(id);
            toast({
                title: "Role deleted",
                variant: "success",
            });
            await fetchRoles();
        } catch (err) {
            console.error(err);
            toast({
                title: "Role delete failed",
                variant: "destructive",
            });
        }
    };

    /* ---------------- ACTIVE / INACTIVE ---------------- */
    const handleToggle = async (id: string) => {
        try {
            await inActiveRole(id);
            toast({
                title: "Role updated",
                variant: "success",
            });
            await fetchRoles();
        } catch (err) {
            console.error(err);
            toast({
                title: "Role update failed",
                variant: "destructive",
            });
        }
    };

    /* ---------------- UI ---------------- */
    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

            {/* TOP BAR */}
            <div className="flex flex-col md:flex-row justify-between gap-3">

                <div className="relative w-full md:max-w-sm">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        className="pl-9"
                        placeholder="Search roles..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>

                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Role
                </Button>

            </div>

            {/* TABLE */}
            <div className="bg-white border rounded-xl shadow overflow-hidden">

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {paginated.map((role) => (
                            <TableRow key={role.id}>

                                <TableCell className="font-medium">
                                    {role.name}
                                </TableCell>

                                <TableCell>
                                    {role.description || "-"}
                                </TableCell>

                                <TableCell>
                                    {role.isSystem ? (
                                        <Badge>System</Badge>
                                    ) : (
                                        <Badge variant="secondary">Custom</Badge>
                                    )}
                                </TableCell>

                                <TableCell>
                                    {new Date(role.createdAt).toLocaleDateString()}
                                </TableCell>

                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">

                                        {/* EDIT */}
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => handleEdit(role)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>

                                        {/* TOGGLE ACTIVE */}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleToggle(role.id)}
                                        >
                                            Toggle
                                        </Button>

                                        {/* DELETE */}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="icon" variant="destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>

                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Delete Role
                                                    </AlertDialogTitle>

                                                    <AlertDialogDescription>
                                                        This will permanently delete{" "}
                                                        <strong>{role.name}</strong>
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>

                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Cancel
                                                    </AlertDialogCancel>

                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(role.id)}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

                                    </div>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </div>

            {/* MODAL */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-lg">

                    <DialogHeader>
                        <DialogTitle>
                            {editing ? "Edit Role" : "Add Role"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-3">

                        <Input
                            placeholder="Role name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />

                        <Input
                            placeholder="Description"
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                        />

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>

                            <Button type="submit">
                                {editing ? "Update" : "Create"}
                            </Button>
                        </div>

                    </form>

                </DialogContent>
            </Dialog>

        </div>
    );
}