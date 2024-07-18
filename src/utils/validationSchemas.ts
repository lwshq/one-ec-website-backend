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
    contact_number: z.string(),
    address: z.string().optional(),
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
  modules: z.array(z.enum(["soa", "role", "users"])).min(1, "At least one module is required"),
});

export const roleSchemaUpdate = z.object({
  name: z.string().max(255).optional(),
  permissions: z.array(z.enum(["view", "add", "edit", "delete"])).min(1, "At least one permission is required").optional(),
  modules: z.array(z.enum(["soa", "role", "users"])).min(1, "At least one module is required").optional(),
});

export const coorSchemaCreate = z.object({
  first_name: z.string().optional(),
  middle_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email().or(z.string().min(1, "Email is required")),
  contact_number: z.string().min(1, "Contact number is required"),
  address: z.string().optional(),
})

export const assignRolesSchema = z.object({
  roleIds: z.array(z.number()).min(1, "At least one role is required")
});

export const coorSchemaUpdate = z.object({
  first_name: z.string().optional(),
  middle_name: z.string().optional(),
  last_name: z.string().optional(),
  contact_number: z.string().min(1, "Contact number is required").optional(),
  address: z.string().optional(),
});