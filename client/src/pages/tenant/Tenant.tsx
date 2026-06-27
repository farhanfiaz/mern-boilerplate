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

import { PaginatedTenants, Tenant } from "@/types/tenant/tenant.types";
import { Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { tenantSchema } from "@/validations/tenant.validations";
import { useAllTenants } from "@/hooks/queries/useTenant";
import { useCreateTenant, useDeleteTenant, useEditTenant, useInActivateTenant } from "@/hooks/mutations/useTenantMutations";
import logger from "@/utils/logger";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/utils";
import { useTenanNameUniqueMutation, useTenantSlugUniqueMutation } from "@/hooks/mutations/useAuthMutation";

export default function TenantPage() {
    /* ---------------- MODAL ---------------- */
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const { data, isLoading, error } = useAllTenants(page, pageSize, search);

    const tenants = data?.data ?? [];
    const pagination = data?.pagination;

    const { mutate: createTenant, isPending: isCreatingTenant, error: createTenantError } = useCreateTenant();
    const { mutate: editTenant, isPending: isEditingTenant, error: editTenantError } = useEditTenant();
    const { mutate: deleteTenant, isPending: isDeletingTenant, error: deleteTenantError } = useDeleteTenant();
    const { mutate: inActiveTenant, isPending: isInActiveTenant, error: inActiveTenantError } = useInActivateTenant();

    /* ---------------- FORM ---------------- */
    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: "",
        website: "",
        logo: "",
    });

    /* ---------------- FILE UPLOAD ---------------- */
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setForm((prev) => ({
                ...prev,
                logo: reader.result as string,
            }));
        };
        reader.readAsDataURL(file);
    };

    /* ---------------- ADD ---------------- */
    const handleAdd = () => {
        setErrors({});
        setEditing(false);
        setEditingId(null);
        setForm({
            name: "",
            slug: "",
            description: "",
            website: "",
            logo: "",
        });
        setOpen(true);
    };

    /* ---------------- EDIT ---------------- */
    const handleEdit = (tenant: Tenant) => {
        setErrors({});
        setEditing(true);
        setEditingId(tenant.id);

        setForm({
            name: tenant.name,
            slug: tenant.slug,
            description: tenant.description || "",
            website: tenant.website || "",
            logo: tenant.logo || "",
        });

        setOpen(true);
    };

    /* ---------------- CREATE / UPDATE ---------------- */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = tenantSchema.safeParse(form);

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
                editTenant({
                    id: editingId,
                    name: form.name,
                    slug: form.slug,
                    description: form.description,
                    website: form.website,
                    logo: form.logo,
                }, {
                    onSuccess: () => {
                        setEditingId(null);
                        setEditing(false);
                        setOpen(false);
                    },
                    onError: () => { }
                });

            } else {
                createTenant({
                    name: form.name,
                    slug: form.slug,
                    description: form.description,
                    website: form.website,
                    logo: form.logo,
                }, {
                    onSuccess: () => {
                        setOpen(false);
                    },
                    onError: () => {

                    },
                });
            }

        } catch (err) {
            logger.error(err);
        }
    };

    /* ---------------- DELETE ---------------- */
    const handleDelete = async (id: string) => {
        try {
            deleteTenant(id);
        } catch (err) {
            logger.error(err);
        }
    };

    /* ---------------- ACTIVE / INACTIVE ---------------- */
    const handleToggleActive = async (id: string, isActive: boolean) => {
        try {
            inActiveTenant(id);
        } catch (err) {
            logger.error(err);
        }
    };

    const { mutate: tenantSlugUniqueValidate, isPending: isTenantSlugValidate, isError: isTenantSlugValidError } = useTenantSlugUniqueMutation();
    useEffect(() => {
        if (form.slug) {
            tenantSlugUniqueValidate(form.slug, {
                onSuccess: (resp) => {
                    if (resp.isUnique) {
                        setErrors((prev) => ({
                            ...prev,
                            slug: "",
                        }));
                    } else {
                        setErrors((prev) => ({
                            ...prev,
                            slug: resp.message,
                        }));
                    }
                },
                onError: (err) => {
                    setErrors((prev) => ({
                        ...prev,
                        slug: err.message,
                    }));
                    logger.error(err);
                }
            });
        }
    }, [form.slug]);
    const { mutate: tenantNameUniqueValidate, isPending: isTenantNameValidate, isError: isTenantNameValidError } = useTenanNameUniqueMutation();
    useEffect(() => {
        if (form.name) {
            tenantNameUniqueValidate(form.name, {
                onSuccess: (resp) => {
                    if (resp.isUnique) {
                        setErrors((prev) => ({
                            ...prev,
                            name: "",
                        }));
                    } else {
                        setErrors((prev) => ({
                            ...prev,
                            name: resp.message || "Name already exists",
                        }));
                    }
                },
                onError: (err) => {
                    if (!err.response.data.success) {
                        setErrors((prev) => ({
                            ...prev,
                            name: err.response.data.message || "Name already exists",
                        }));
                    } else {
                        setErrors((prev) => ({
                            ...prev,
                            name: "",
                        }));
                    }
                    logger.error(err.response.data);

                }
            });
        }
    }, [form.name]);

    /* ---------------- UI ---------------- */
    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

            {/* TOP BAR */}
            <div className="flex flex-col md:flex-row justify-between gap-3">

                <div className="relative w-full md:max-w-sm">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        className="pl-9"
                        placeholder="Search tenants..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>

                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Tenant
                </Button>

            </div>

            {/* TABLE */}
            <div className="bg-white border rounded-xl shadow overflow-hidden">

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Logo</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Website</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        )}
                        {tenants.map((tenant) => (
                            <TableRow key={tenant.id}>

                                <TableCell>
                                    <Avatar className="h-10 w-10 border-4 border-white shadow-lg ring-2 ring-gray-100 dark:border-slate-900 dark:ring-slate-800">
                                        <AvatarImage
                                            loading="lazy"
                                            src={
                                                tenant.logo ? `${tenant.logo}`
                                                    : undefined
                                            }
                                            alt={getInitials(tenant?.name ?? "", "")}
                                        />
                                        <AvatarFallback>
                                            {getInitials(tenant?.name ?? "", "")}
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>

                                <TableCell className="font-medium">
                                    {tenant.name}
                                </TableCell>

                                <TableCell>{tenant.slug}</TableCell>

                                <TableCell className="text-blue-600">
                                    {tenant.website || "-"}
                                </TableCell>

                                <TableCell>
                                    <Badge variant={tenant.isActive ? "default" : "secondary"}>
                                        {tenant.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>

                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">

                                        {/* EDIT */}
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            disabled={isEditingTenant || isInActiveTenant}
                                            onClick={() => handleEdit(tenant)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                            {isEditingTenant && (
                                                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                            )}
                                        </Button>

                                        {/* TOGGLE ACTIVE */}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={isEditingTenant || isInActiveTenant}
                                            onClick={() => handleToggleActive(tenant.id, tenant.isActive)}
                                        >
                                            {tenant.isActive ? "Deactivate" : "Activate"}
                                            {(isInActiveTenant) && (
                                                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                            )}
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
                                                        Delete Tenant
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will remove <strong>{tenant.name}</strong>
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>

                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Cancel
                                                    </AlertDialogCancel>

                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(tenant.id)}
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
                            {editing ? "Edit Tenant" : "Add Tenant"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-3">

                        {/* LOGO */}
                        <Input type="file" accept="image/*" onChange={handleLogoUpload} />

                        {form.logo && (
                            <img
                                src={form.logo}
                                className="h-14 w-14 rounded-md border object-cover"
                            />
                        )}

                        <Input
                            placeholder="Name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name}</p>
                        )}

                        <Input
                            placeholder="Slug"
                            value={form.slug}
                            onChange={(e) =>
                                setForm({ ...form, slug: e.target.value })
                            }
                        />
                        {errors.slug && (
                            <p className="text-sm text-red-500">{errors.slug}</p>
                        )}

                        <Input
                            placeholder="Website"
                            value={form.website}
                            onChange={(e) =>
                                setForm({ ...form, website: e.target.value })
                            }
                        />
                        {errors.website && (
                            <p className="text-sm text-red-500">{errors.website}</p>
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
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>

                            <Button type="submit" disabled={editing ? isEditingTenant : isCreatingTenant}>
                                {editing ? "Update" : "Create"}
                                {editing ? isEditingTenant && (
                                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                ) : isCreatingTenant && (
                                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                )}
                            </Button>
                        </div>

                    </form>

                </DialogContent>
            </Dialog>

        </div>
    );
}