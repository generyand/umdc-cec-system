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
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { getDepartmentData } from "./mock-data-depts";

export default function DepartmentPage() {
  const { slug } = useParams<{ slug: string }>();
  const departmentData = useMemo(() => getDepartmentData(slug || ""), [slug]);

  if (!departmentData) {
    return <div>Department not found</div>;
  }

  const stats = [
    {
      icon: UsersIcon,
      iconColor: "text-primary",
      iconBgColor: "bg-primary/10",
      title: "Active Academic Programs",
      subtitle: "Currently running",
      value: departmentData.academicPrograms.active.length,
      unit:
        departmentData.academicPrograms.active.length === 1
          ? "program"
          : "programs",
    },
    {
      icon: ArchiveIcon,
      iconColor: "text-orange-500",
      iconBgColor: "bg-orange-100 dark:bg-orange-500/10",
      title: "Inactive Programs",
      subtitle: "Historical records",
      value: departmentData.academicPrograms.inactive.length,
      unit:
        departmentData.academicPrograms.inactive.length === 1
          ? "program"
          : "programs",
    },
    {
      icon: FlagIcon,
      iconColor: "text-blue-500",
      iconBgColor: "bg-blue-100 dark:bg-blue-500/10",
      title: "Banner Programs",
      subtitle: "Featured initiatives",
      value: departmentData.bannerPrograms.length,
      unit: departmentData.bannerPrograms.length === 1 ? "program" : "programs",
    },
    {
      icon: ClipboardListIcon,
      iconColor: "text-green-500",
      iconBgColor: "bg-green-100 dark:bg-green-500/10",
      title: "Total Projects",
      subtitle: "Implemented activities",
      value: departmentData.implementedProjects.length,
      unit:
        departmentData.implementedProjects.length === 1
          ? "project"
          : "projects",
    },
  ];

  return (
    <div className="mx-auto space-y-8 w-full">
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
                {/* Active Programs */}
                <div>
                  <h3 className="mb-4 text-sm font-medium text-muted-foreground">
                    Active Academic Programs
                  </h3>
                  <div className="space-y-3">
                    {departmentData.academicPrograms.active.map(
                      (program, index) => (
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
                      )
                    )}
                  </div>
                </div>

                {/* Inactive Programs */}
                <div className="pt-4 border-t">
                  <h3 className="mb-4 text-sm font-medium text-muted-foreground">
                    Inactive Programs
                  </h3>
                  <div className="space-y-3">
                    {departmentData.academicPrograms.inactive.map(
                      (program, index) => (
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
                      )
                    )}
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
                {departmentData.bannerPrograms[0] && (
                  <>
                    <div className="flex justify-between items-start mb-8">
                      <div className="space-y-1">
                        <Badge
                          variant="secondary"
                          className="text-white border-0 backdrop-blur-sm bg-white/10 hover:bg-white/20"
                        >
                          Banner Program
                        </Badge>
                        <p className="text-sm text-white/60">
                          Active since{" "}
                          {departmentData.bannerPrograms[0].yearStarted}
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
                            {departmentData.bannerPrograms[0].title}
                          </h2>
                          <p className="max-w-3xl leading-relaxed text-white/80">
                            {departmentData.bannerPrograms[0].description}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-4 md:grid-cols-4">
                          <div className="p-4 rounded-lg backdrop-blur-sm bg-white/10">
                            <p className="mb-1 text-sm text-white/60">
                              Target Projects
                            </p>
                            <p className="text-2xl font-bold text-white">
                              {departmentData.stats.implementedProjects.target}
                            </p>
                          </div>
                          <div className="p-4 rounded-lg backdrop-blur-sm bg-white/10">
                            <p className="mb-1 text-sm text-white/60">
                              Completed
                            </p>
                            <p className="text-2xl font-bold text-white">
                              {
                                departmentData.stats.implementedProjects
                                  .completed
                              }
                            </p>
                          </div>
                          <div className="p-4 rounded-lg backdrop-blur-sm bg-white/10">
                            <p className="mb-1 text-sm text-white/60">
                              Target Reach
                            </p>
                            <p className="text-2xl font-bold text-white">
                              {departmentData.stats.implementedProjects.totalBeneficiaries.target.toLocaleString()}
                            </p>
                          </div>
                          <div className="p-4 rounded-lg backdrop-blur-sm bg-white/10">
                            <p className="mb-1 text-sm text-white/60">
                              Current Reach
                            </p>
                            <div className="flex gap-2 items-end">
                              <p className="text-2xl font-bold text-white">
                                {departmentData.stats.implementedProjects.totalBeneficiaries.actual.toLocaleString()}
                              </p>
                              <p className="mb-1 text-sm text-white/60">
                                (
                                {Math.round(
                                  (departmentData.stats.implementedProjects
                                    .totalBeneficiaries.actual /
                                    departmentData.stats.implementedProjects
                                      .totalBeneficiaries.target) *
                                    100
                                )}
                                %)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-2">
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500 bg-white/90"
                            style={{
                              width: `${
                                (departmentData.stats.implementedProjects
                                  .totalBeneficiaries.actual /
                                  departmentData.stats.implementedProjects
                                    .totalBeneficiaries.target) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                        <p className="text-sm text-white/60">
                          Overall Progress
                        </p>
                      </div>
                    </div>
                  </>
                )}
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
              <BarChart data={departmentData.analyticsData}>
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
