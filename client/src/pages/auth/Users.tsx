import { useEffect, useMemo, useState } from "react";

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

import { Copy, Eye, EyeOff, KeyRound, Pencil, Plus, Search, ShieldCheck, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/utils";
import { User } from "@/types/user-management/user-management.types";
import logger from "@/utils/logger";
import { useUserManagement, useCreateUser, useUpdateUser, useDeleteUser } from "@/hooks/queries/useUserManagement";
import { useResetPasswordMutation } from "@/hooks/mutations/useUserMutation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { userSchema } from "@/validations/register.validation";
import { useEmailUniqueMutation } from "@/hooks/mutations/useAuthMutation";

export default function Users() {

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        phone: "",
    });

    const { data, isLoading, error } = useUserManagement(page, pageSize, search, "", "");
    const { mutate: createUser, isPending: isCreating, error: createError } = useCreateUser();
    const { mutate: updateUser, isPending: isUpdating, error: updateError } = useUpdateUser();
    const { mutate: deleteUser, isPending: isDeleting, error: deleteError } = useDeleteUser();
    const { mutate: resetPassword, isPending: isResetPassword, error: isResetPasswordError } = useResetPasswordMutation();

    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState(false);

    const users = data?.users ?? [];
    const totalPages = data?.totalPages ?? 1;

    /* ---------------- ADD ---------------- */

    const handleAdd = () => {
        setErrors({});
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
        setErrors({});
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

    /* ---------------- CREATE / UPDATE ---------------- */

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = userSchema.safeParse(form);

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
                const existingUser = users.find((u) => u.id === editingId);

                if (!existingUser) return;

                updateUser({
                    ...existingUser,
                    ...form,
                }, {
                    onSuccess: () => { },
                    onError: (error) => { }
                });
            } else {
                createUser({
                    id: "",
                    image: "",
                    isActive: true,
                    isDeleted: false,
                    createdAt: new Date().toISOString(),
                    ...form,
                }, {
                    onSuccess: () => { },
                    onError: (error) => { }
                });
            }

            setOpen(false);
        } catch (error) {
            logger.error(error);
        }
    };

    /* ---------------- DELETE ---------------- */

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            deleteUser(deleteId, {
                onSuccess: () => {
                    setDeleteId(null);
                },
                onError: (error) => {
                    logger.error(error);
                }
            });
        } catch (error) {
            logger.error(error);
        }
    };

    const handleResetPassword = (user: User) => {
        if (!user.id) return;
        resetPassword({
            userId: user.id,
            resetPassword: "",
        }, {
            onSuccess: (res) => {
                logger.info(`responce: ${res}`);
                setGeneratedPassword(String(res));
                setPasswordDialogOpen(true);
            },
            onError: (err) => {
                logger.error(err);
            }
        });
    };
    const copyPassword = async () => {
        await navigator.clipboard.writeText(generatedPassword);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    const { mutate: emailUniqueValidate, isPending: isEmailValidate, isError: isEmailValidError } = useEmailUniqueMutation();
    useEffect(() => {
        if (form.email) {
            emailUniqueValidate(form.email, {
                onSuccess: (resp) => {
                    if (resp.isUnique) {
                        setErrors((prev) => ({
                            ...prev,
                            email: "",
                        }));
                    } else {
                        setErrors((prev) => ({
                            ...prev,
                            email: resp.message || "Email already exists",
                        }));
                    }
                },
                onError: (err) => {
                    setErrors((prev) => ({
                            ...prev,
                            email: err.message || "Email already exists",
                        }));
                    logger.error(err.response.data);

                }
            });
        }
    }, [form.email]);
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
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-6">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : users?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-6">
                                    No users found
                                </TableCell>
                            </TableRow>
                        ) : (
                            users?.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <Avatar className="h-10 w-10 border-4 border-white shadow-lg ring-2 ring-gray-100 dark:border-slate-900 dark:ring-slate-800">
                                            <AvatarImage
                                                loading="lazy"
                                                src={
                                                    user?.image ? `/api/users/${user?.id}/photo`
                                                        : undefined
                                                }
                                                alt={getInitials(user?.firstName ?? "", user?.lastName ?? "")}
                                            />
                                            <AvatarFallback>
                                                {getInitials(user.firstName, user.lastName)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TableCell>

                                    <TableCell>
                                        {user.firstName} {user.lastName}
                                    </TableCell>

                                    <TableCell>{user.email}</TableCell>

                                    <TableCell>{user.username || "-"}</TableCell>

                                    <TableCell>
                                        <Badge
                                            variant={user.isActive ? "default" : "destructive"}
                                        >
                                            {user.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            onClick={() => handleResetPassword(user)}
                                            disabled={isResetPassword}
                                        >
                                            <KeyRound className="h-4 w-4" />
                                        </Button>
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
                            ))
                        )}
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
                        {errors.firstName && (
                            <p className="text-sm text-red-500">{errors.firstName}</p>
                        )}

                        <Input
                            placeholder="Last Name"
                            value={form.lastName}
                            onChange={(e) =>
                                setForm({ ...form, lastName: e.target.value })
                            }
                        />
                        {errors.lastName && (
                            <p className="text-sm text-red-500">{errors.lastName}</p>
                        )}

                        <Input
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email}</p>
                        )}

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

            {/* ------------- reset password ----------- */}
            <Dialog
                open={passwordDialogOpen}
                onOpenChange={setPasswordDialogOpen}
            >
                <DialogContent className="sm:max-w-md">

                    <DialogHeader>

                        <DialogTitle className="flex items-center gap-2">

                            <ShieldCheck className="h-5 w-5 text-green-600" />

                            Password Reset Successful

                        </DialogTitle>

                        <p className="text-sm text-gray-500 mt-1">
                            A new secure password has been generated for the user.
                        </p>

                    </DialogHeader>

                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">

                        <label className="text-sm font-semibold text-green-700">
                            New Password
                        </label>

                        <div className="flex gap-2 mt-2">

                            <Input
                                value={generatedPassword}
                                readOnly
                                type={showPassword ? "text" : "password"}
                            />

                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={copyPassword}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>

                        </div>

                        {copied && (
                            <p className="text-green-600 text-xs mt-2">
                                Password copied!
                            </p>
                        )}

                    </div>

                    <Alert className="bg-orange-50 border-orange-200">

                        <AlertDescription>

                            <span className="font-semibold text-orange-700">
                                Important:
                            </span>{" "}

                            Please share this password securely with the user.
                            They should change it after their first login for
                            security.

                        </AlertDescription>

                    </Alert>

                    <div className="flex justify-end">

                        <Button
                            onClick={() => setPasswordDialogOpen(false)}
                        >
                            I've Saved the Password
                        </Button>

                    </div>

                </DialogContent>
            </Dialog>

        </div>
    );
}