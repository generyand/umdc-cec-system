import { AddDepartmentForm } from "@/components/admin/academic-departments/add-department-form";

export default function NewDepartmentPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Add New Department
        </h1>
        <p className="text-muted-foreground">
          Create a new academic department by filling out the form below.
        </p>
      </div>

      <div className="max-w-2xl">
        <AddDepartmentForm />
      </div>
    </div>
  );
}
