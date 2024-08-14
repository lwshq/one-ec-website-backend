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
  modules: z.array(z.enum(["/soa", "/role", "/users", "/customer-management", "/approvals"])).min(1, "At least one module is required"),
});

export const roleSchemaUpdate = z.object({
  name: z.string().max(255).optional(),
  permissions: z.array(z.enum(["view", "add", "edit", "delete"])).min(1, "At least one permission is required").optional(),
  modules: z.array(z.enum(["/soa", "/role", "/users", "/customer-management", "/approvals"])).min(1, "At least one module is required").optional(),
});

export const createCoordinatorSchema = z.object({
  data: z.object({
    first_name: z.string().optional(),
    middle_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().email().or(z.string().min(1, "Email is required")),
    contact_number: z.string().min(1, "Contact number is required"),
    address: z.string().optional(),
  }),
  roleIds: z.array(z.number()).min(1, "At least one role is required")
});

export const coorSchemaUpdate = z.object({
  first_name: z.string().optional(),
  middle_name: z.string().optional(),
  last_name: z.string().optional(),
  contact_number: z.string().min(1, "Contact number is required").optional(),
  address: z.string().optional(),
});

export const billCreationSchema = z.object({
  fromDate: z.string()
    .refine(val => !isNaN(Date.parse(val)), "Invalid date format for 'fromDate'. Expected format: YYYY-MM-DD")
    .transform(val => new Date(val)),
  toDate: z.string()
    .refine(val => !isNaN(Date.parse(val)), "Invalid date format for 'toDate'. Expected format: YYYY-MM-DD")
    .transform(val => new Date(val)),
  dueDate: z.string()
    .refine(val => !isNaN(Date.parse(val)), "Invalid date format for 'dueDate'. Expected format: YYYY-MM-DD")
    .transform(val => new Date(val)),
  nextDate: z.string()
    .refine(val => !isNaN(Date.parse(val)), "Invalid date format for 'nextDate'. Expected format: YYYY-MM-DD")
    .transform(val => new Date(val)),
  billDate: z.string()
    .refine(val => !isNaN(Date.parse(val)), "Invalid date format for 'billDate'. Expected format: YYYY-MM-DD")
    .transform(val => new Date(val)),
  readingDate: z.string()
    .refine(val => !isNaN(Date.parse(val)), "Invalid date format for 'readingDate'. Expected format: YYYY-MM-DD")
    .transform(val => new Date(val)),
  kwhConsume: z.number()
    .positive("kWh consumption must be a positive number"),
  rate: z.number()
    .positive("Rate must be a positive number"),
  distribution: z.number()
    .default(0),
  generation: z.number()
    .default(0),
  sLoss: z.number()
    .default(0),
  transmission: z.number()
    .default(0),
  subsidies: z.number()
    .default(0),
  gTax: z.number()
    .default(0),
  fitAll: z.number()
    .default(0),
  applied: z.number()
    .default(0),
  other: z.number()
    .default(0)
});

export const updateCoordinatorSchema = z.object({
  data: z.object({
    first_name: z.string().optional(),
    middle_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().email().optional().or(z.string().min(1, "Email is required").optional()),
    contact_number: z.string().min(1, "Contact number is required").optional(),
    address: z.string().optional(),
  }),
  roleIds: z.array(z.number()).min(1, "At least one role is required").optional()
});

export const userDataSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string().optional().nullable(),
  last_name: z.string().min(1, "Last name is required"),
  birthdate: z.string()
    .refine(val => !isNaN(Date.parse(val)), "Invalid date format for 'birthdate'. Expected format: YYYY-MM-DD")
    .transform(val => new Date(val)).optional().nullable(),
  email: z.string().email("Invalid email format"),
  contact_number: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  role: z.enum(['USER']).optional(),
  address: z.string().optional().nullable()
});

export const meterDataSchema = z.object({
  meterNumber: z.number().min(1, "Meter number must be valid"),
  meterAccountName: z.string().optional(),
  meterAddress: z.string().optional(),
  customerType: z.string().optional(),
  meterActivated: z.boolean().optional()
});

export const userSchema = z.object({
  first_name: z.string().max(255),
  middle_name: z.string().nullable().optional(),
  last_name: z.string().max(255),
  birthdate: z.string()
  .refine(val => !isNaN(Date.parse(val)), "Invalid date format for 'birthdate'. Expected format: YYYY-MM-DD")
  .transform(val => new Date(val)),
  email: z.string().email(),
  contact_number: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  address: z.string().max(255).nullable().optional(),
  password: z.string().min(8)
});

export const custUpdateSchema = z.object({
  first_name: z.string().optional(),
  middle_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email().optional(),
  contact_number: z.string(),
  address: z.string().optional(),
  gender: z.string().optional(),
  birthdate: z.string()
  .refine(val => !isNaN(Date.parse(val)), "Invalid date format for 'birthdate'. Expected format: YYYY-MM-DD")
  .transform(val => new Date(val)).optional(),
});