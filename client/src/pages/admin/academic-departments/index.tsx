import { Users, BookOpen, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { departmentsApi } from "@/services/api/departments.services";
import { AddDepartmentModal } from "@/components/admin/academic-departments/add-department-modal";
import { Department } from "@/types/department.types";

// Types
interface DepartmentCardProps {
  id: string;
  name: string;
  slug: string;
  students?: number;
  academicPrograms?: Department["academicPrograms"];
  description: string;
  icon?: React.ReactNode;
}

function DepartmentCard({
  name,
  slug,
  students = 0,
  academicPrograms = [],
  description,
  icon,
}: DepartmentCardProps) {
  return (
    <Link
      to={`/admin/academic-departments/${slug}`}
      className="block p-6 rounded-lg border transition-all duration-200 group bg-card hover:shadow-lg hover:border-primary/20"
    >
      <div className="flex gap-4 items-start">
        <div className="p-3 rounded-lg transition-colors bg-primary/10 group-hover:bg-primary/20">
          {icon && (
            <div className="w-8 h-8">
              {typeof icon === "string" ? (
                <img
                  src={icon}
                  alt={name}
                  className="object-contain w-full h-full"
                />
              ) : (
                icon
              )}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h2 className="mb-2 text-xl font-semibold transition-colors group-hover:text-primary">
            {name}
          </h2>
          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
          <div className="space-y-2 text-muted-foreground">
            <div className="flex gap-2 items-center">
              <Users className="w-4 h-4" />
              <span>{students} Students</span>
            </div>
            <div className="flex gap-2 items-center">
              <BookOpen className="w-4 h-4" />
              <span>{academicPrograms?.length} Academic Programs</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function DepartmentsPage() {
  const { data: departments, refetch } = useQuery({
    queryKey: ["departments"],
    queryFn: departmentsApi.getAll,
  });

  if (!departments) return [];

  const formattedDepartments = departments.data.map((department) => ({
    ...department,
    students: department.academicPrograms.reduce(
      (acc, program) => acc + program.totalStudents,
      0
    ),
  }));

  console.log(formattedDepartments);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">
              Academic Departments
            </h2>
            <p className="text-muted-foreground">
              Manage your institution's academic departments
            </p>
          </div>
          <AddDepartmentModal onDepartmentCreated={() => refetch()} />
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search departments..." className="pl-9" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 rounded-lg border bg-card">
            <p className="text-sm font-medium text-muted-foreground">
              Total Departments
            </p>
            <p className="text-2xl font-bold">
              {departments?.data?.length || 0}
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <p className="text-sm font-medium text-muted-foreground">
              Total Students
            </p>
            <p className="text-2xl font-bold">
              {formattedDepartments?.reduce(
                (acc, dept) => acc + (dept.students || 0),
                0
              )}
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <p className="text-sm font-medium text-muted-foreground">
              Total Programs
            </p>
            <p className="text-2xl font-bold">
              {formattedDepartments?.reduce(
                (acc, dept) => acc + (dept.academicPrograms.length || 0),
                0
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {formattedDepartments?.length ? (
          formattedDepartments.map((department) => (
            <DepartmentCard key={department.id} {...department} />
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col col-span-full justify-center items-center p-8 text-center rounded-lg border bg-muted/10">
      <Users className="mb-4 w-10 h-10 text-muted-foreground" />
      <h3 className="mb-1 text-lg font-semibold">No departments found</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Get started by creating your first academic department.
      </p>
      <AddDepartmentModal />
    </div>
  );
}

// Helper function to map slugs to their respective icons
// function getIconBySlug(slug: string): React.ReactNode {
//   const iconMap: Record<string, React.ReactNode> = {
//     dae: DAELogo,
//     dase: DASELogo,
//     dba: DBALogo,
//     dcje: DCJELogo,
//     dte: DTELogo,
//     dtp: DTPLogo,
//     shs: SHSLogo,
//     alumni: <Users className="w-full h-full" />,
//     ntp: <Users className="w-full h-full" />,
//   };

//   return iconMap[slug] || <Users className="w-full h-full" />;
// }
