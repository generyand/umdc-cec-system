import { z } from "zod";

// Enum for academic program status
const AcademicProgramStatus = z.enum(["ACTIVE", "INACTIVE"]);

// Base schema with shared fields
const academicProgramBaseSchema = {
  name: z
    .string()
    .min(2, "Program name must be at least 2 characters")
    .max(100, "Program name must not exceed 100 characters"),
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
  status: AcademicProgramStatus.default("ACTIVE"),
  departmentId: z
    .number()
    .int()
    .positive("Department ID must be a positive number"),
};

// Schema for creating a new academic program
export const createAcademicProgramSchema = z.object({
  body: z.object({
    ...academicProgramBaseSchema,
    // Remove optional fields that shouldn't be required for creation
    description: z.string().max(500).optional(),
    totalStudents: z.number().int().nonnegative().default(0),
    status: AcademicProgramStatus.default("ACTIVE"),
  }),
});

// Schema for updating an existing academic program
export const updateAcademicProgramSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Academic Program ID is required"),
  }),
  body: z.object({
    ...academicProgramBaseSchema,
    // Make all fields optional for updates
    name: academicProgramBaseSchema.name.optional(),
    description: z.string().max(500).optional(),
    totalStudents: z.number().int().nonnegative().optional(),
    status: AcademicProgramStatus.optional(),
    departmentId: academicProgramBaseSchema.departmentId.optional(),
  }),
});

// Types based on the schemas
export type CreateAcademicProgramInput = z.infer<
  typeof createAcademicProgramSchema
>["body"];
export type UpdateAcademicProgramInput = z.infer<
  typeof updateAcademicProgramSchema
>["body"];
