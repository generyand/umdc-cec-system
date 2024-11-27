import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  UsersIcon,
  ArchiveIcon,
  FlagIcon,
  ClipboardListIcon,
  ArrowUpRight,
} from "lucide-react";
import { StatCard } from "@/components/admin/academic-departments/stat-card";

// Mock data for DASE
const academicPrograms = {
  active: [
    {
      code: "BSED-Science",
      name: "Bachelor of Secondary Education Major in Science",
      students: 380,
      yearStarted: 1998,
    },
    {
      code: "BSED-Math",
      name: "Bachelor of Secondary Education Major in Mathematics",
      students: 420,
      yearStarted: 1998,
    },
    {
      code: "BS Biology",
      name: "Bachelor of Science in Biology",
      students: 290,
      yearStarted: 2010,
    },
  ],
  inactive: [
    {
      code: "BS Chemistry",
      name: "Bachelor of Science in Chemistry",
      yearEnded: 2015,
      lastGraduates: 45,
    },
  ],
};

const bannerPrograms = [
  {
    title: "Science and Mathematics Outreach Program",
    description:
      "An innovative community outreach initiative focused on promoting STEM education through interactive workshops, mobile laboratories, and mentorship programs for high school students.",
    status: "Active",
    yearStarted: 2022,
    targetBeneficiaries: 3000,
    actualBeneficiaries: 1850,
  },
];

const implementedProjects = [
  {
    title: "Mobile Science Laboratory",
    date: "March 20, 2024",
    targetBeneficiaries: 300,
    actualBeneficiaries: 275,
    location: "Various High Schools",
    status: "Completed",
  },
  {
    title: "Mathematics Teaching Workshop",
    date: "February 10, 2024",
    targetBeneficiaries: 150,
    actualBeneficiaries: 130,
    location: "Partner Schools",
    status: "Completed",
  },
];

const analyticsData = [
  { month: "Jan", beneficiaries: 180 },
  { month: "Feb", beneficiaries: 130 },
  { month: "Mar", beneficiaries: 275 },
  { month: "Apr", beneficiaries: 220 },
  { month: "May", beneficiaries: 310 },
  { month: "Jun", beneficiaries: 180 },
];

const bannerProgramStats = {
  totalPrograms: 4,
  implementedProjects: {
    total: 15,
    target: 20,
    completed: 12,
    ongoing: 3,
    totalBeneficiaries: {
      target: 3000,
      actual: 1850,
    },
  },
};

export default function DASEPage() {
  const stats = [
    {
      icon: UsersIcon,
      iconColor: "text-primary",
      iconBgColor: "bg-primary/10",
      title: "Active Academic Programs",
      subtitle: "Currently running",
      value: academicPrograms.active.length,
      unit: academicPrograms.active.length === 1 ? "program" : "programs",
    },
    {
      icon: ArchiveIcon,
      iconColor: "text-orange-500",
      iconBgColor: "bg-orange-100 dark:bg-orange-500/10",
      title: "Inactive Programs",
      subtitle: "Historical records",
      value: academicPrograms.inactive.length,
      unit: academicPrograms.inactive.length === 1 ? "program" : "programs",
    },
    {
      icon: FlagIcon,
      iconColor: "text-blue-500",
      iconBgColor: "bg-blue-100 dark:bg-blue-500/10",
      title: "Banner Programs",
      subtitle: "Featured initiatives",
      value: bannerPrograms.length,
      unit: bannerPrograms.length === 1 ? "program" : "programs",
    },
    {
      icon: ClipboardListIcon,
      iconColor: "text-green-500",
      iconBgColor: "bg-green-100 dark:bg-green-500/10",
      title: "Total Projects",
      subtitle: "Implemented activities",
      value: implementedProjects.length,
      unit: implementedProjects.length === 1 ? "project" : "projects",
    },
  ];

  return (
    <div className="mx-auto space-y-8 max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col gap-6 p-6 rounded-lg border md:flex-row md:items-center md:justify-between bg-card">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Department of Arts & Sciences Education
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Advancing STEM education through innovative teaching and community
            engagement
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
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8">
        {/* Top Section Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Academic Programs Column */}
          <div className="lg:col-span-1">
            <Card className="h-full border shadow-sm">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-foreground">
                    Academic Programs
                  </h2>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="mb-4 text-sm font-medium text-muted-foreground">
                    Active Academic Programs
                  </h3>
                  <div className="space-y-3">
                    {academicPrograms.active.map((program, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-start p-3 rounded-lg transition-colors hover:bg-accent/10"
                      >
                        <div>
                          <h4 className="font-medium text-foreground">
                            {program.code}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {program.name}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-emerald-700 bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400"
                        >
                          Active
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <h3 className="mb-4 text-sm font-medium text-muted-foreground">
                    Inactive Programs
                  </h3>
                  <div className="space-y-3">
                    {academicPrograms.inactive.map((program, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-start p-3 rounded-lg transition-colors hover:bg-accent/10"
                      >
                        <div>
                          <h4 className="font-medium text-foreground">
                            {program.code}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {program.name}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-gray-700 bg-gray-100 dark:bg-gray-500/20 dark:text-gray-400"
                        >
                          Inactive
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Banner Program Column */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden relative h-full border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700" />
              <div className="absolute inset-0 bg-black/5" />
              <div className="flex relative flex-col p-8 h-full">
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-1">
                    <Badge
                      variant="secondary"
                      className="text-white border-0 backdrop-blur-sm bg-white/10 hover:bg-white/20"
                    >
                      Banner Program
                    </Badge>
                    <p className="text-sm text-white/60">
                      Active since {bannerPrograms[0].yearStarted}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-white border-0 backdrop-blur-sm bg-white/10 hover:bg-white/20"
                  >
                    View Details
                  </Button>
                </div>

                <div className="flex flex-col flex-1 justify-between space-y-6">
                  <div className="space-y-6">
                    <div>
                      <h2 className="mb-3 text-2xl font-bold text-white">
                        {bannerPrograms[0].title}
                      </h2>
                      <p className="max-w-3xl leading-relaxed text-white/80">
                        {bannerPrograms[0].description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4 md:grid-cols-4">
                      {/* Stats grid content */}
                      {/* ... copy the four stat boxes from DAE ... */}
                    </div>
                  </div>

                  {/* Progress bar section */}
                  <div className="space-y-2">
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-white/90"
                        style={{
                          width: `${
                            (bannerProgramStats.implementedProjects
                              .totalBeneficiaries.actual /
                              bannerProgramStats.implementedProjects
                                .totalBeneficiaries.target) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <p className="text-sm text-white/60">Overall Progress</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Analytics Section */}
        <Card className="p-6 border shadow-sm md:p-8">
          <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Monthly Analytics
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Beneficiaries reached per month
              </p>
            </div>
            <Button variant="outline" size="sm" className="self-start">
              Export
            </Button>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis dataKey="month" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-2 rounded-lg border shadow-lg bg-background">
                          <p className="text-sm text-foreground">
                            {`${payload[0].value} beneficiaries`}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="beneficiaries"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
