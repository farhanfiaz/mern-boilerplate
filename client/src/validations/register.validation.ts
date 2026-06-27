/* ---------------- Schema ---------------- */

import z from "zod";

export const registerSchema = z.object({
  // Tenant
  tenantName: z.string().trim()
    .min(2, "Name must be at least 2 characters"),
  tenantSlug: z.string().trim()
    .min(2, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers and hyphens"
    ),
  tenantDescription: z.string().trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  tenantWebsite: z.string().url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  tenantLogo: z.any().optional(),

  // User
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  avatar: z.any().optional(),
});

export type RegisterForm = z.infer<typeof registerSchema>;

export const userSchema = z.object({
   firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  email: z.string().trim().email(),
  username: z.string().trim().min(2),
  avatar: z.any().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;

export const roleSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().max(256)
});

export type RoleFormData = z.infer<typeof roleSchema>;