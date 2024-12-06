import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import {
  CreateDepartmentDTO,
  departmentsApi,
} from "@/services/api/departments.service";

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
});

interface DepartmentFormModalProps {
  mode: "create" | "edit";
  department?: {
    id: string;
    name: string;
    abbreviation: string;
    description: string;
  };
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function DepartmentFormModal({
  mode = "create",
  department,
  onSuccess,
  trigger,
}: DepartmentFormModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateDepartmentDTO>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: department?.name ?? "",
      abbreviation: department?.abbreviation ?? "",
      description: department?.description ?? "",
      numberOfStudents: 0,
    },
  });

  async function onSubmit(data: CreateDepartmentDTO) {
    try {
      setIsSubmitting(true);

      const submitData = {
        name: data.name,
        abbreviation: data.abbreviation,
        description: data.description,
        ...(data.numberOfStudents
          ? { numberOfStudents: data.numberOfStudents }
          : {}),
      };

      console.log("Submitting:", { mode, data: submitData });

      const response =
        mode === "create"
          ? await departmentsApi.create(submitData as CreateDepartmentDTO)
          : await departmentsApi.update(department!.id, submitData);

      console.log("Response:", response);

      if (response.success) {
        toast.success(
          mode === "create"
            ? "Department created successfully"
            : "Department updated successfully"
        );
        setIsOpen(false);
        form.reset();
        onSuccess?.();
      } else {
        toast.error(response.message ?? `Failed to ${mode} department`);
      }
      // setIsSubmitting(false);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An unexpected error occurred", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="">
            <Plus className="mr-2 w-4 h-4" />
            Add Department
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Department" : "Edit Department"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(onSubmit)(e);
            }}
            className="space-y-4"
          >
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
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? mode === "create"
                    ? "Creating..."
                    : "Saving..."
                  : mode === "create"
                  ? "Create"
                  : "Save changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
