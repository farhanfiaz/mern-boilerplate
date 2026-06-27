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

import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCreateMutationRole, useUpdateMutationRole, useDeleteMutationRole, useInActiveMutationRole, useRole } from "@/hooks/queries/useRole";
import logger from "@/utils/logger";
import { roleSchema } from "@/validations/register.validation";

export default function Roles() {

    /* ---------------- STATE ---------------- */
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const { data: rolesData, isLoading, error } = useRole();
    const { mutate: createRole, isPending: isCreating, error: isCreateError } = useCreateMutationRole();
    const { mutate: updateRole, isPending: isUpdating, error: isUpdateError } = useUpdateMutationRole();
    const { mutate: deleteRole, isPending: isDeleting, error: isDeleteError } = useDeleteMutationRole();
    const { mutate: inActiveRole, isPending: isInActive, error: isInActiveError } = useInActiveMutationRole();

    const roles = rolesData?.data ?? [];
    const pagination = rolesData?.pagination;

    /* ---------------- MODAL ---------------- */
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    /* ---------------- FORM ---------------- */
    const [form, setForm] = useState({
        name: "",
        description: "",
    });

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
        setErrors({});
        setEditing(false);
        setEditingId(null);
        setForm({ name: "", description: "" });
        setOpen(true);
    };

    /* ---------------- EDIT ---------------- */
    const handleEdit = (role: any) => {
        setErrors({});
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
        const result = roleSchema.safeParse(form);

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};

            result.error.issues.forEach((err) => {
                const field = err.path[0] as string;
                fieldErrors[field] = err.message;
            });

            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        try {
            if (editing && editingId) {
                if (!editingId || !form.name) {
                    return;
                }
                updateRole({
                    id: editingId,
                    name: form.name,
                    description: form.description,
                }, {
                    onSuccess: () => { setOpen(false); },
                    onError: () => { },
                });
            } else {
                if (!form.name) {
                    return;
                }
                createRole({
                    name: form.name,
                    description: form.description,
                    isSystem: false,
                }, {
                    onSuccess: () => { setOpen(false); },
                    onError: () => { },
                });
            }

        } catch (err) {
            logger.error(err);
        }
    };

    /* ---------------- DELETE ---------------- */
    const handleDelete = async (id: string) => {
        try {
            deleteRole(id, {
                onSuccess: () => { },
                onError: () => { },
            });
        } catch (err) {
            logger.error(err);
        }
    };

    /* ---------------- ACTIVE / INACTIVE ---------------- */
    const handleToggle = async (id: string) => {
        try {
            inActiveRole(id, {
                onSuccess: () => { },
                onError: () => { },
            });
        } catch (err) {
            logger.error(err);
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
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                            </TableRow>
                        ) : paginated.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">No roles found</TableCell>
                            </TableRow>
                        ) : (
                            paginated.map((role) => (
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
                                        {role.isActive ? (
                                            <Badge variant="outline">Active</Badge>
                                        ) : (
                                            <Badge variant="secondary">Inactive</Badge>
                                        )}
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
                                                {role.isActive ? "Deactivate" : "Activate"}
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
                            )))}
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
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name}</p>
                        )}

                        <Input
                            placeholder="Description"
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description}</p>
                        )}

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