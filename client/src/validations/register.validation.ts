/* ---------------- Schema ---------------- */

import z from "zod";

export const registerSchema = z.object({
  // Tenant
  tenantName: z.string().min(2),
  tenantSlug: z.string().min(2),
  tenantDescription: z.string().optional(),
  tenantWebsite: z.string().optional(),
  tenantLogo: z.any().optional(),

  // User
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  avatar: z.any().optional(),
});

export type RegisterForm = z.infer<typeof registerSchema>;