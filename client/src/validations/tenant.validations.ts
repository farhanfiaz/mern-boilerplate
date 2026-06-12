// schemas/tenant.schema.ts
import { z } from "zod";

export const tenantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters"),

  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers and hyphens"
    ),

  website: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  logo: z
    .string()
    .optional(),
});

export type TenantFormData = z.infer<typeof tenantSchema>;