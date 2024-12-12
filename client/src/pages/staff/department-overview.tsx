import { useQuery } from "@tanstack/react-query";
import { departmentsApi } from "@/services/api/departments.service";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Target,
  Calendar,
  ArrowUpRight,
  ArchiveIcon,
  FlagIcon,
  ClipboardListIcon,
  CalendarCheck,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const DepartmentOverviewSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-6 p-6 rounded-lg border md:flex-row md:items-center md:justify-between bg-card">
        <div className="space-y-3">
          <Skeleton className="h-8 w-[300px]" /> {/* Department name */}
          <Skeleton className="h-4 w-[100px]" /> {/* Abbreviation */}
          <Skeleton className="h-4 w-[400px]" /> {/* Description */}
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-[140px]" /> {/* Download button */}
          <Skeleton className="h-10 w-[160px]" /> {/* Create button */}
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <div className="flex gap-4 items-center">
              <Skeleton className="w-12 h-12 rounded-lg" /> {/* Icon */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" /> {/* Title */}
                <Skeleton className="h-6 w-[60px]" /> {/* Value */}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Programs Grid Skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Academic Programs Skeleton */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-[200px]" /> {/* Title */}
                  <Skeleton className="h-4 w-[150px]" /> {/* Subtitle */}
                </div>
                <Skeleton className="h-9 w-[80px]" /> {/* Button */}
              </div>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-6 p-6">
              {/* Active Programs */}
              <div className="space-y-4">
                <div className="flex gap-2 items-center">
                  <Skeleton className="h-5 w-[150px]" /> {/* Section title */}
                  <Skeleton className="h-5 w-[30px]" /> {/* Count */}
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-lg border">
                    <div className="space-y-3">
                      <Skeleton className="h-5 w-[200px]" />{" "}
                      {/* Program name */}
                      <Skeleton className="w-full h-4" /> {/* Description */}
                      <Skeleton className="h-4 w-[100px]" /> {/* Stats */}
                    </div>
                  </div>
                ))}
              </div>
              {/* Inactive Programs - Similar structure */}
              <div className="space-y-4">
                <div className="flex gap-2 items-center">
                  <Skeleton className="h-5 w-[150px]" />
                  <Skeleton className="h-5 w-[30px]" />
                </div>
                {[1, 2].map((i) => (
                  <div key={i} className="p-4 rounded-lg border border-dashed">
                    <div className="space-y-3">
                      <Skeleton className="h-5 w-[200px]" />
                      <Skeleton className="w-full h-4" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Banner Programs Skeleton */}
        <div className="lg:col-span-1">
          <Card className="h-[600px]">
            <div className="p-6 border-b">
              <Skeleton className="h-6 w-[150px] mb-2" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 bg-gradient-to-br rounded-lg from-blue-600/30 to-indigo-700/30"
                >
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-[100px]" />
                    <Skeleton className="h-6 w-[150px]" />
                    <Skeleton className="w-full h-4" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Activities Section Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="h-[600px] flex flex-col">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <Skeleton className="h-9 w-[80px]" />
              </div>
            </div>
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="p-4 rounded-lg border">
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-[250px]" />
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default function StaffDepartmentOverviewPage() {
  const { user } = useAuth();

  // Get department data using React Query
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["department", user?.department?.id],
    queryFn: async () => {
      const departmentId = user?.department?.id;
      if (!departmentId) {
        throw new Error("Department ID not found");
      }
      return departmentsApi.getById(departmentId);
    },
    enabled: !!user?.department?.id, // Only run query if departmentId exists
  });

  console.log(user);

  // Show loading state
  if (isLoading) {
    return <DepartmentOverviewSkeleton />;
  }

  // Show error state
  if (error || !response?.success) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-destructive">
          Failed to load department information
        </p>
      </div>
    );
  }

  const departmentData = response.data;

  const stats = [
    {
      icon: Target,
      iconColor: "text-primary",
      iconBgColor: "bg-primary/10",
      title: "Active Programs",
      value: departmentData.academicPrograms.active.length,
      unit: "programs",
    },
    {
      icon: Users,
      iconColor: "text-orange-500",
      iconBgColor: "bg-orange-100",
      title: "Total Students",
      value: departmentData.department.totalStudents,
      unit: "students",
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
      title: "Activities",
      value: departmentData.activities.length,
      unit: "activities",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6 p-6 rounded-lg border md:flex-row md:items-center md:justify-between bg-card">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {departmentData.department.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {departmentData.department.abbreviation}
          </p>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {departmentData.department.description}
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
            <div className="flex gap-4 items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-lg shrink-0",
                  stat.iconBgColor
                )}
              >
                <stat.icon className={cn("w-6 h-6", stat.iconColor)} />
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <div className="flex gap-2 items-baseline">
                  <p className="text-2xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                  <span className="text-sm text-muted-foreground">
                    {stat.unit}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Programs Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Academic Programs */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <div className="flex-shrink-0 p-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">Academic Programs</h2>
                  <p className="text-sm text-muted-foreground">
                    Department's academic programs
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-6 p-6 min-h-0">
              {/* Active Programs */}
              <div className="flex flex-col col-span-1 min-h-0">
                <div className="flex top-0 z-10 flex-shrink-0 gap-2 items-center mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <h3 className="text-lg font-medium">Active Programs</h3>
                  <Badge variant="secondary">
                    {departmentData.academicPrograms.active.length}
                  </Badge>
                </div>
                <div className="overflow-y-auto flex-1 pr-4 scrollbar-thin">
                  <div className="space-y-4">
                    {departmentData.academicPrograms.active.map((program) => (
                      <div
                        key={program.id}
                        className="p-4 rounded-lg border transition-all hover:border-primary/20 hover:shadow-sm"
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap gap-2 items-center">
                            <h4 className="font-medium transition-colors group-hover:text-primary">
                              {program.name}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {program.abbreviation}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {program.description}
                          </p>
                          <div className="flex gap-2 items-center">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {program.totalStudents}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Inactive Programs */}
              <div className="flex flex-col col-span-1 min-h-0">
                <div className="flex top-0 z-10 flex-shrink-0 gap-2 items-center mb-4">
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  <h3 className="text-lg font-medium">Inactive Programs</h3>
                  <Badge variant="secondary">
                    {departmentData.academicPrograms.inactive.length}
                  </Badge>
                </div>
                <div className="overflow-y-auto flex-1 pr-4 scrollbar-thin">
                  {departmentData.academicPrograms.inactive.length > 0 ? (
                    <div className="space-y-4">
                      {departmentData.academicPrograms.inactive.map(
                        (program) => (
                          <div
                            key={program.id}
                            className="p-4 rounded-lg border border-dashed transition-all hover:border-primary/20 hover:shadow-sm bg-muted/30"
                          >
                            <div className="flex flex-col gap-2">
                              <div className="flex flex-wrap gap-2 items-center">
                                <h4 className="font-medium text-muted-foreground">
                                  {program.name}
                                </h4>
                                <Badge variant="outline" className="text-xs">
                                  {program.abbreviation}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {program.description}
                              </p>
                              <div className="flex gap-2 items-center">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium text-muted-foreground">
                                  {program.totalStudents}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center items-center p-8 text-center rounded-lg border border-dashed">
                      <ArchiveIcon className="mb-4 w-12 h-12 text-muted-foreground/50" />
                      <h3 className="text-lg font-semibold">
                        No Inactive Programs
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        There are no inactive programs at the moment.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Banner Programs */}
        <div className="lg:col-span-1">
          <Card className="h-[600px]">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Banner Programs</h2>
              <p className="text-sm text-muted-foreground">
                Featured extension programs
              </p>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto h-[calc(600px-88px)] scrollbar-thin">
              {departmentData.bannerPrograms.map((program) => (
                <div
                  key={program.id}
                  className="p-4 text-white bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Badge
                        variant="secondary"
                        className="text-white bg-white/10"
                      >
                        {program.status}
                      </Badge>
                      <h3 className="text-lg font-semibold">
                        {program.abbreviation}
                      </h3>
                      <p className="text-sm text-white/80">
                        {program.description}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-white bg-white/10 shrink-0"
                    >
                      Started {program.yearStarted}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Activities Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Activities */}
        <Card className="h-[600px] flex flex-col">
          <div className="flex-shrink-0 p-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex gap-2 items-center">
                  <h2 className="text-xl font-semibold">Upcoming Activities</h2>
                  <span className="px-2 py-0.5 text-xs font-medium text-muted-foreground bg-muted rounded-full">
                    {departmentData.activities.length}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Scheduled activities and events
                </p>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-6 scrollbar-thin">
            <div className="space-y-4">
              {departmentData.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 rounded-lg border transition-all hover:border-primary/20 hover:shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 mr-4 space-y-1 min-w-0">
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {activity.description}
                      </p>
                      {activity.bannerProgram && (
                        <div className="flex gap-2 items-center mt-2">
                          <Badge variant="outline" className="text-xs">
                            {activity.bannerProgram.abbreviation}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {activity.bannerProgram.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 items-center text-muted-foreground shrink-0">
                      <Calendar className="w-4 h-4" />
                      <time className="text-sm">
                        {new Date(activity.targetDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </time>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Completed Activities */}
        <Card className="h-[600px] flex flex-col">
          <div className="flex-shrink-0 p-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex gap-2 items-center">
                  <h2 className="text-xl font-semibold">
                    Completed Activities
                  </h2>
                  <span className="px-2 py-0.5 text-xs font-medium text-muted-foreground bg-muted rounded-full">
                    0
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Past activities and events
                </p>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-6 scrollbar-thin">
            <div className="flex flex-col justify-center items-center p-8 text-center">
              <CalendarCheck className="mb-4 w-12 h-12 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold">No Completed Activities</h3>
              <p className="text-sm text-muted-foreground">
                There are no completed activities to display.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}