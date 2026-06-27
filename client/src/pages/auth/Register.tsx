import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import { Camera } from "lucide-react";
import { RegisterForm, registerSchema } from "@/validations/register.validation";
import { useEmailUniqueMutation, useTenanNameUniqueMutation, useTenantSlugUniqueMutation } from "@/hooks/mutations/useAuthMutation";
import logger from "@/utils/logger";


export default function Register() {
  const { register: registerUser, user } = useAuth();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  const avatarRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      tenantName: "",
      tenantSlug: "",
      tenantDescription: "",
      tenantWebsite: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  if (user) {
    setLocation("/dashboard");
    return null;
  }

  /* ---------------- Image Handlers ---------------- */

  const handleAvatar = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (avatarPreview) URL.revokeObjectURL(avatarPreview);

    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    form.setValue("avatar", file);
  };

  const handleLogo = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (logoPreview) URL.revokeObjectURL(logoPreview);

    const url = URL.createObjectURL(file);
    setLogoPreview(url);
    form.setValue("tenantLogo", file);
  };

  /* ---------------- Submit ---------------- */

  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true);

      const formData = new FormData();

      // Tenant
      formData.append("tenantName", data.tenantName);
      formData.append("tenantSlug", data.tenantSlug || "");
      formData.append("tenantDescription", data.tenantDescription || "");
      formData.append("tenantWebsite", data.tenantWebsite || "");

      if (data.tenantLogo) {
        formData.append("tenantLogo", data.tenantLogo);
      }

      // User
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("password", data.password);

      if (data.avatar) {
        formData.append("avatar", data.avatar);
      }

      await registerUser(formData as any);
    } finally {
      setLoading(false);
    }
  };
  const { mutate: tenantSlugUniqueValidate, isPending: isTenantSlugValidate, isError: isTenantSlugValidError } = useTenantSlugUniqueMutation();
  const tenantSlug = form.watch("tenantSlug");
  const { mutate: tenantNameUniqueValidate, isPending: isTenantNameValidate, isError: isTenantNameValidError } = useTenanNameUniqueMutation();
  const tenantName = form.watch("tenantName");
  const { mutate: emailUniqueValidate, isPending: isEmailValidate, isError: isEmailValidError } = useEmailUniqueMutation();
  const email = form.watch("email");
  useEffect(() => {
    if (!tenantName) return;
    const timer = setTimeout(async () => {
      tenantNameUniqueValidate(tenantName, {
        onSuccess: (resp) => {
          if (resp.isUnique) {
            form.clearErrors("tenantName");
          } else {
            form.setError("tenantName", {
              type: "server",
              message: resp.message,
            });
          }
        },
        onError: (err) => {
          if (!err.response.data.success) {
            form.setError("tenantName", {
              type: "server",
              message: err.response.data.message,
            });
          } else {
            form.clearErrors("tenantName");
          }
          logger.error(err.response.data);
        }
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [tenantName]);
  useEffect(() => {
    if (!tenantSlug) return;

    const timer = setTimeout(async () => {
      tenantSlugUniqueValidate(tenantSlug, {
        onSuccess: (resp) => {
          if (resp.isUnique) {
            form.clearErrors("tenantSlug");
          } else {
            form.setError("tenantSlug", {
              type: "server",
              message: resp.message,
            });
          }
        },
        onError: (err) => {
          form.setError("tenantSlug", {
            type: "server",
            message: err.message,
          });
          logger.error(err);
        }
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [tenantSlug]);
  useEffect(() => {
    if (!email) return;

    const timer = setTimeout(async () => {
      emailUniqueValidate(email, {
        onSuccess: (resp) => {
          if (resp.isUnique) {
            form.clearErrors("email");
          } else {
            form.setError("email", {
              type: "server",
              message: resp.message,
            });
          }
        },
        onError: (err) => {
          form.setError("email", {
            type: "server",
            message: err.message,
          });
          logger.error(err);
        }
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [email]);

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">

      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* ================= LEFT: TENANT ================= */}
        <div className="p-8 border-r bg-gradient-to-b from-purple-50 to-white">

          <h2 className="text-xl font-bold mb-6">🏢 Tenant Information</h2>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">

              <input type="file" ref={logoRef} hidden onChange={handleLogo} />

              <div
                onClick={() => logoRef.current?.click()}
                className="w-24 h-24 rounded-xl border bg-white flex items-center justify-center cursor-pointer overflow-hidden"
              >
                {logoPreview ? (
                  <img src={logoPreview} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-gray-400">Upload Logo</span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">

            <div>
              <Label>Tenant Name</Label>
              <Input {...form.register("tenantName")} />
              {form.formState.errors.tenantName && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.tenantName.message}
                </p>
              )}
            </div>

            <div>
              <Label>Slug</Label>
              <Input {...form.register("tenantSlug")} />
              {form.formState.errors.tenantSlug && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.tenantSlug.message}
                </p>
              )}
            </div>

            <div>
              <Label>Description</Label>
              <Input {...form.register("tenantDescription")} />
              {form.formState.errors.tenantDescription && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.tenantDescription.message}
                </p>
              )}
            </div>

            <div>
              <Label>Website</Label>
              <Input {...form.register("tenantWebsite")} />
              {form.formState.errors.tenantWebsite && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.tenantWebsite.message}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* ================= RIGHT: USER ================= */}
        <div className="p-8">

          <h2 className="text-xl font-bold mb-6">👤 Owner Information</h2>

          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="relative w-28 h-28">

              <input type="file" ref={avatarRef} hidden onChange={handleAvatar} />

              <div
                onClick={() => avatarRef.current?.click()}
                className="w-28 h-28 rounded-full border-4 border-purple-500 overflow-hidden cursor-pointer bg-gray-200"
              >
                {avatarPreview ? (
                  <img src={avatarPreview} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    Avatar
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => avatarRef.current?.click()}
                className="absolute bottom-1 right-1 bg-black text-white p-2 rounded-full"
              >
                <Camera size={14} />
              </button>

            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>First Name</Label>
                <Input {...form.register("firstName")} />
                {form.formState.errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Last Name</Label>
                <Input {...form.register("lastName")} />
                {form.formState.errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label>Email</Label>
              <Input {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label>Password</Label>
              <Input type="password" {...form.register("password")} />
              {form.formState.errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button className="w-full mt-4" disabled={loading}>
              {loading ? "Creating workspace..." : "Create Workspace"}
            </Button>

            <p className="text-sm text-center mt-3">
              Already have account?{" "}
              <Link to="/login" className="text-purple-600">
                Login
              </Link>
            </p>

          </form>

        </div>
      </div>
    </div>
  );
}