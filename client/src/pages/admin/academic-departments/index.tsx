import { Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
// import {
//   DAELogo,
//   DASELogo,
//   DBALogo,
//   DCJELogo,
//   DTELogo,
//   DTPLogo,
//   SHSLogo,
// } from "@/assets/images/department-logos";
import { departmentsApi } from "@/services/api/departments.services";
import { AddDepartmentModal } from "@/components/admin/academic-departments/add-department-modal";

// Types
interface DepartmentCardProps {
  id: string;
  name: string;
  slug: string;
  students?: number;
  programs?: number;
  description: string;
  icon?: React.ReactNode;
}

function DepartmentCard({
  name,
  slug,
  students = 0,
  programs = 0,
  description,
  icon,
}: DepartmentCardProps) {
  return (
    <Link
      to={`/admin/academic-departments/${slug}`}
      className="block p-6 rounded-lg border transition-shadow bg-card hover:shadow-md"
    >
      <div className="flex gap-4 items-start">
        <div className="p-3 rounded-lg bg-primary/10">
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
          <h2 className="mb-2 text-xl font-semibold">{name}</h2>
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
              <span>{programs} Academic Programs</span>
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

  return (
    <div className="space-y-6">
      <div className="flex gap-4 justify-between items-center">
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {departments?.data?.length ? (
          departments.data.map((department) => (
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
