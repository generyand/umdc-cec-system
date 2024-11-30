import { z } from "zod";

// Enum for department status
const DepartmentStatus = z.enum(["ACTIVE", "INACTIVE"]);

// Base schema with shared fields
const departmentBaseSchema = {
  name: z
    .string()
    .min(2, "Department name must be at least 2 characters")
    .max(100, "Department name must not exceed 100 characters"),
  abbreviation: z
    .string()
    .min(2, "Abbreviation must be at least 2 characters")
    .max(10, "Abbreviation must not exceed 10 characters")
    .toUpperCase(),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
  totalStudents: z
    .number()
    .int()
    .nonnegative("Total students cannot be negative")
    .default(0),
  status: DepartmentStatus.default("ACTIVE"),
};

// Schema for creating a new department
export const createDepartmentSchema = z.object({
  body: z.object({
    ...departmentBaseSchema,
    // Remove optional fields that shouldn't be required for creation
    description: z.string().max(500).optional(),
    totalStudents: z.number().int().nonnegative().default(0),
    status: DepartmentStatus.default("ACTIVE"),
  }),
});

// Schema for updating an existing department
export const updateDepartmentSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Department ID is required"),
  }),
  body: z.object({
    ...departmentBaseSchema,
    // Make all fields optional for updates
    name: departmentBaseSchema.name.optional(),
    abbreviation: departmentBaseSchema.abbreviation.optional(),
    description: z.string().max(500).optional(),
    totalStudents: z.number().int().nonnegative().optional(),
    status: DepartmentStatus.optional(),
  }),
});

// Types based on the schemas
export type CreateDepartmentInput = z.infer<
  typeof createDepartmentSchema
>["body"];
export type UpdateDepartmentInput = z.infer<
  typeof updateDepartmentSchema
>["body"];
