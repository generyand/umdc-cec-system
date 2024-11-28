import { Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { departmentsData } from "./mock-data-depts";

import {
  DAELogo,
  DASELogo,
  DBALogo,
  DCJELogo,
  DTELogo,
  DTPLogo,
  SHSLogo,
} from "@/assets/images/department-logos";

interface DepartmentCardProps {
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
  const departments = Object.values(departmentsData).map((dept) => ({
    name: dept.name,
    slug: dept.slug,
    students: dept.academicPrograms.active.reduce(
      (total, program) => total + (program.students || 0),
      0
    ),
    programs: dept.academicPrograms.active.length,
    description: dept.description,
    icon: getIconBySlug(dept.slug),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Academic Departments</h1>
        <p className="text-muted-foreground">
          Overview of all academic departments and their programs
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((department) => (
          <DepartmentCard key={department.slug} {...department} />
        ))}
      </div>
    </div>
  );
}

// Helper function to map slugs to their respective icons
function getIconBySlug(slug: string): React.ReactNode {
  const iconMap: Record<string, React.ReactNode> = {
    dae: DAELogo,
    dase: DASELogo,
    dba: DBALogo,
    dcje: DCJELogo,
    dte: DTELogo,
    dtp: DTPLogo,
    shs: SHSLogo,
    alumni: <Users className="w-full h-full" />,
    ntp: <Users className="w-full h-full" />,
  };

  return iconMap[slug] || <Users className="w-full h-full" />;
}
