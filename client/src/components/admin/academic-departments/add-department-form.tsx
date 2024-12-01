import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

import {
  CreateDepartmentDTO,
  departmentsApi,
} from "@/services/api/departments.services";

const departmentSchema = z.object({
  name: z.string().min(3, "Department name must be at least 3 characters"),
  abbreviation: z
    .string()
    .min(2, "Abbreviation must be at least 2 characters")
    .max(6, "Abbreviation must not exceed 6 characters")
    .toUpperCase(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  numberOfStudents: z
    .number()
    .min(0, "Number of students cannot be negative")
    .or(z.string().regex(/^\d+$/).transform(Number)),
});

export function AddDepartmentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<CreateDepartmentDTO>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      abbreviation: "",
      description: "",
      numberOfStudents: 0,
    },
  });

  async function onSubmit(data: CreateDepartmentDTO) {
    try {
      setIsSubmitting(true);
      const response = await departmentsApi.create(data);

      if (response.success) {
        toast.success(response.message ?? "Department created successfully");
        navigate("/admin/academic-departments");
      } else {
        toast.error(response.message ?? "Failed to create department");
      }
    } catch (error) {
      // This will only trigger for network errors or other unexpected issues
      toast.error("An unexpected error occurred", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="p-6 mx-auto max-w-2xl">
      {/* <div className="mb-6">
        <h2 className="text-xl font-semibold">Create New Department</h2>
        <p className="text-sm text-muted-foreground">
          Fill in the department details below
        </p>
      </div> */}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Department of Technical Programs"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="abbreviation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Abbreviation</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., DTP"
                      className="uppercase"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter department description"
                    className="resize-none"
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numberOfStudents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Students</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="max-w-xs"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/academic-departments")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Department"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
