import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  UsersIcon,
  ArchiveIcon,
  FlagIcon,
  ClipboardListIcon,
  ArrowUpRight,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data
const departmentData = {
  name: "College of Computer Studies",
  description:
    "The College of Computer Studies is dedicated to providing quality education in the field of computing and information technology.",
  academicPrograms: {
    active: [
      { code: "BSCS", name: "Bachelor of Science in Computer Science" },
      { code: "BSIT", name: "Bachelor of Science in Information Technology" },
    ],
    inactive: [
      { code: "BSIS", name: "Bachelor of Science in Information Systems" },
    ],
  },
  bannerPrograms: [
    {
      title: "Digital Literacy Program",
      description:
        "A community-based program aimed at improving digital literacy among underserved communities.",
      yearStarted: 2023,
      stats: {
        target: 10,
        completed: 6,
      },
    },
    {
      title: "Tech for Communities",
      description:
        "Empowering local communities through technology education and resources.",
      yearStarted: 2023,
      stats: {
        target: 8,
        completed: 3,
      },
    },
    {
      title: "Youth Innovation Hub",
      description:
        "Fostering innovation and entrepreneurship among young tech enthusiasts.",
      yearStarted: 2023,
      stats: {
        target: 5,
        completed: 2,
      },
    },
  ],
  stats: {
    implementedProjects: {
      target: 10,
      completed: 6,
      totalBeneficiaries: {
        target: 1000,
        actual: 650,
      },
    },
  },
};

export default function MockDepartmentPage() {
  const navigate = useNavigate();

  const stats = [
    {
      icon: UsersIcon,
      iconColor: "text-primary",
      iconBgColor: "bg-primary/10",
      title: "Active Programs",
      value: departmentData.academicPrograms.active.length,
      unit: "programs",
    },
    {
      icon: ArchiveIcon,
      iconColor: "text-orange-500",
      iconBgColor: "bg-orange-100",
      title: "Inactive Programs",
      value: departmentData.academicPrograms.inactive.length,
      unit: "programs",
    },
    {
      icon: FlagIcon,
      iconColor: "text-blue-500",
      iconBgColor: "bg-blue-100",
      title: "Banner Programs",
      value: departmentData.bannerPrograms.length,
      unit: "programs",
    },
    {
      icon: ClipboardListIcon,
      iconColor: "text-green-500",
      iconBgColor: "bg-green-100",
      title: "Projects Completed",
      value: departmentData.stats.implementedProjects.completed,
      unit: "projects",
    },
  ];

  return (
    <div className="mx-auto space-y-8 w-full">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="flex gap-2 items-center hover:bg-accent/50"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Departments</span>
      </Button>

      {/* Header Section */}
      <div className="flex flex-col gap-6 p-6 rounded-lg border md:flex-row md:items-center md:justify-between bg-card">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {departmentData.name}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {departmentData.description}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Download Report</Button>
          <Button className="flex gap-2 items-center">
            Create New Program <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex gap-2">
              <div className={`p-2 rounded-lg ${stat.iconBgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold">
                  {stat.value} {stat.unit}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Programs Section - Restructured */}
      <div className="grid gap-8">
        {/* Top Row: Academic Programs and Active Banner Program */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Academic Programs */}
          <Card className="col-span-1 h-fit">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Academic Programs</h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {/* Show only first 3 programs with a "Show More" button if there are more */}
                {departmentData.academicPrograms.active
                  .slice(0, 3)
                  .map((program, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{program.code}</p>
                        <p className="text-sm text-muted-foreground">
                          {program.name}
                        </p>
                      </div>
                      <Badge className="text-green-800 bg-green-100">
                        Active
                      </Badge>
                    </div>
                  ))}
                {departmentData.academicPrograms.active.length > 3 && (
                  <Button variant="ghost" className="mt-4 w-full">
                    Show {departmentData.academicPrograms.active.length - 3}{" "}
                    more programs
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Featured Banner Program */}
          {departmentData.bannerPrograms.length > 0 && (
            <Card className="col-span-2 text-white bg-gradient-to-br from-blue-600 to-indigo-700">
              <div className="p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge
                      variant="secondary"
                      className="text-white bg-white/10"
                    >
                      Featured Banner Program
                    </Badge>
                    <div className="mt-4">
                      <h3 className="text-2xl font-bold">
                        {departmentData.bannerPrograms[0].title}
                      </h3>
                      <p className="mt-2 text-white/80">
                        {departmentData.bannerPrograms[0].description}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-white bg-white/10">
                    Started {departmentData.bannerPrograms[0].yearStarted}
                  </Badge>
                </div>
                {/* Progress stats remain the same */}
              </div>
            </Card>
          )}
        </div>

        {/* Other Banner Programs Grid */}
        {departmentData.bannerPrograms.length > 1 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Other Banner Programs</h2>
              <Button variant="outline" size="sm">
                View All Programs
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {departmentData.bannerPrograms.slice(1).map((program, index) => (
                <Card
                  key={index}
                  className="text-white bg-gradient-to-br from-blue-500 to-indigo-600"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold">{program.title}</h3>
                      <Badge
                        variant="secondary"
                        className="text-white bg-white/10"
                      >
                        {program.yearStarted}
                      </Badge>
                    </div>
                    <p className="mb-4 text-sm text-white/80">
                      {program.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm text-white/60">Progress</p>
                        <p className="text-lg font-bold">
                          {Math.round(
                            (program.stats.completed / program.stats.target) *
                              100
                          )}
                          %
                        </p>
                      </div>
                      <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-white/90"
                          style={{
                            width: `${
                              (program.stats.completed / program.stats.target) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
