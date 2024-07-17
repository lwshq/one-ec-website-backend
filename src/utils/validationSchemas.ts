import { z } from "zod";

export const requestResetSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8),
  confirmPassword: z.string()
}).refine(data => data.confirmPassword === data.newPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const coopSchema = z.object({
  name: z.string().max(255),
  description: z.string().optional().nullable(),
  address: z.string().max(255),
  coordinator: z.object({
    first_name: z.string().optional(),
    middle_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().email(),
    contact_number: z.string()
  }),
});

export const coopSchemaUpdate = z.object({
  name: z.string().max(255).optional(),
  description: z.string().optional().nullable(),
  address: z.string().max(255).optional(),
});

export const roleSchemaCreate = z.object({
  name: z.string().max(255),
  permissions: z.array(z.enum(["view", "add", "edit", "delete"])).min(1, "At least one permission is required"),
  modules: z.array(z.string().min(1)).min(1, "Atleast one module is required"),
});

export const roleSchemaUpdate = z.object({
  name: z.string().max(255).optional(),
  permissions: z.array(z.enum(["view", "add", "edit", "delete"])).min(1, "At least one permission is required").optional(),
  modules: z.array(z.string().min(1)).min(1, "Atleast one module is required").optional(),
});