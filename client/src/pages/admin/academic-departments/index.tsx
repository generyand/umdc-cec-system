import { Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

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
  const departments = [
    {
      name: "Department of Accounting Education",
      slug: "dae",
      students: 770,
      programs: 2,
      description:
        "Empowering communities through financial education and literacy programs",
      icon: DAELogo,
    },
    {
      name: "Department of Arts & Sciences Education",
      slug: "dase",
      students: 1090,
      programs: 3,
      description:
        "Advancing social sciences and humanities education through innovative teaching and community engagement",
      icon: DASELogo,
    },
    {
      name: "Department of Business Administration",
      slug: "dba",
      students: 850,
      programs: 4,
      description:
        "Developing future business leaders through practical education and industry partnerships",
      icon: DBALogo,
    },
    {
      name: "Department of Criminal Justice Education",
      slug: "dcje",
      students: 680,
      programs: 2,
      description:
        "Training future law enforcement professionals with emphasis on ethics and community service",
      icon: DCJELogo,
    },
    {
      name: "Department of Teacher Education",
      slug: "dte",
      students: 920,
      programs: 5,
      description:
        "Shaping educators who will inspire the next generation of learners",
      icon: DTELogo,
    },
    {
      name: "Department of Technical Programs",
      slug: "dtp",
      students: 560,
      programs: 6,
      description:
        "Providing hands-on technical education aligned with industry needs",
      icon: DTPLogo,
    },
    {
      name: "Senior High School Department",
      slug: "shs",
      students: 1200,
      programs: 4,
      description:
        "Preparing students for higher education and career development",
      icon: SHSLogo,
    },
    {
      name: "Alumni Department",
      slug: "alumni",
      students: 0,
      programs: 3,
      description:
        "Maintaining connections and fostering engagement with our graduates",
      icon: <Users className="w-full h-full" />,
    },
    {
      name: "Non-Teaching Personnel",
      slug: "ntp",
      students: 0,
      programs: 1,
      description:
        "Supporting academic excellence through administrative and operational services",
      icon: <Users className="w-full h-full" />,
    },
  ];

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
