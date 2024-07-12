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
  email: z.string().email(),
  contact: z.string().min(3).optional(),
});

export const coopSchemaUpdate = z.object({
  name: z.string().max(255).optional(),
  description: z.string().optional().nullable(),
  email: z.string().email().optional(),
  contact: z.string().min(3).optional(),
});
