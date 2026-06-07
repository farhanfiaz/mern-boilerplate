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

import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

/* ---------------- TYPES ---------------- */
type Tenant = {
    id: string;
    name: string;
    slug: string;
    description?: string;
    website?: string;
    logo?: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
};

export default function TenantPage() {

    /* ---------------- DATA ---------------- */
    const [tenants, setTenants] = useState<Tenant[]>([
        {
            id: "1",
            name: "Acme Corp",
            slug: "acme",
            description: "Tech company",
            website: "https://acme.com",
            logo: "",
            isActive: true,
            isDeleted: false,
            createdAt: new Date().toISOString(),
        },
        {
            id: "2",
            name: "Beta Ltd",
            slug: "beta",
            description: "Finance company",
            website: "https://beta.com",
            logo: "",
            isActive: false,
            isDeleted: false,
            createdAt: new Date().toISOString(),
        },
    ]);

    /* ---------------- STATE ---------------- */
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 5;

    /* ---------------- FORM ---------------- */
    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: "",
        website: "",
        logo: "", // ✅ ADDED
    });

    /* ---------------- FILE HANDLER ---------------- */
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setForm((prev) => ({
                ...prev,
                logo: reader.result as string, // base64 preview
            }));
        };

        reader.readAsDataURL(file);
    };

    /* ---------------- FILTER ---------------- */
    const filtered = useMemo(() => {
        return tenants.filter(
            (t) =>
                !t.isDeleted &&
                `${t.name} ${t.slug} ${t.website}`
                    .toLowerCase()
                    .includes(search.toLowerCase())
        );
    }, [tenants, search]);

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

    /* ---------------- SAVE ---------------- */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editing && editingId) {
            setTenants((prev) =>
                prev.map((t) =>
                    t.id === editingId ? { ...t, ...form } : t
                )
            );
        } else {
            setTenants((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    ...form,
                    isActive: true,
                    isDeleted: false,
                    createdAt: new Date().toISOString(),
                },
            ]);
        }

        setOpen(false);
    };

    /* ---------------- DELETE ---------------- */
    const handleDelete = (id: string) => {
        setTenants((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, isDeleted: true } : t
            )
        );
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
                        {paginated.map((tenant) => (
                            <TableRow key={tenant.id}>

                                {/* LOGO */}
                                <TableCell>
                                    {tenant.logo ? (
                                        <img
                                            src={tenant.logo}
                                            className="h-9 w-9 rounded-md object-cover border"
                                        />
                                    ) : (
                                        <div className="h-9 w-9 bg-gray-100 border rounded-md" />
                                    )}
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

                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => handleEdit(tenant)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="icon" variant="destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>

                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Tenant</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will remove <strong>{tenant.name}</strong>
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>

                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
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

                        {/* LOGO UPLOAD */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Logo</label>

                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                            />

                            {form.logo && (
                                <img
                                    src={form.logo}
                                    className="h-14 w-14 rounded-md border object-cover"
                                />
                            )}
                        </div>

                        <Input
                            placeholder="Name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />

                        <Input
                            placeholder="Slug"
                            value={form.slug}
                            onChange={(e) =>
                                setForm({ ...form, slug: e.target.value })
                            }
                        />

                        <Input
                            placeholder="Website"
                            value={form.website}
                            onChange={(e) =>
                                setForm({ ...form, website: e.target.value })
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

        </div>
    );
}