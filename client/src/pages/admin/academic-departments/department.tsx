import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { departmentsApi } from "@/services/api/departments.service";
import { DepartmentSkeleton } from "@/components/admin/academic-departments/department-skeleton";
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
  CalendarCheck,
  CalendarClock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function DepartmentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["department", id],
    queryFn: () => departmentsApi.getById(id!),
    enabled: !!id, // Only run query if id exists
  });

  // Debug logs
  console.log("Department ID:", id);
  console.log("API Response:", response);

  if (isLoading) return <DepartmentSkeleton />;

  if (error || !response?.success) {
    toast.error("Failed to load department");
    return <div>Failed to load department</div>;
  }

  const departmentData = response.data;

  console.log(departmentData);

  if (!departmentData) {
    return <div>Department not found</div>;
  }

  const stats = [
    {
      icon: UsersIcon,
      iconColor: "text-primary",
      iconBgColor: "bg-primary/10",
      title: "Total Students",
      value: departmentData.department.totalStudents, // Updated to match API response
      unit: "students",
    },
    {
      icon: ArchiveIcon,
      iconColor: "text-orange-500",
      iconBgColor: "bg-orange-100",
      title: "Academic Programs",
      value: departmentData.academicPrograms.active.length, // Updated to match API response
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
      title: "Activities",
      value: departmentData.activities.length,
      unit: "activities",
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
                  stat.iconBgColor,
                  "transition-colors duration-200 group-hover:bg-primary/20"
                )}
              >
                <stat.icon
                  className={cn(
                    "w-6 h-6",
                    stat.iconColor,
                    "transition-colors duration-200"
                  )}
                />
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
          <Card>
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">Academic Programs</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage department's academic programs
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-8">
              {/* Active Programs */}
              <div>
                <div className="flex gap-2 items-center mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <h3 className="text-lg font-medium">Active Programs</h3>
                  <Badge variant="secondary">
                    {departmentData.academicPrograms.active.length}
                  </Badge>
                </div>
                <div className="space-y-4">
                  {departmentData.academicPrograms.active.map((program) => (
                    <div
                      key={program.id}
                      className="p-4 rounded-lg border transition-all hover:border-primary/20 hover:shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 mr-4 space-y-1 min-w-0">
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
                        </div>
                        <div className="flex gap-2 items-center shrink-0">
                          <UsersIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {program.totalStudents}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inactive Programs */}
              <div>
                <div className="flex gap-2 items-center mb-4">
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  <h3 className="text-lg font-medium">Inactive Programs</h3>
                  <Badge variant="secondary">
                    {departmentData.academicPrograms.inactive.length}
                  </Badge>
                </div>
                {departmentData.academicPrograms.inactive.length > 0 ? (
                  <div className="space-y-4">
                    {departmentData.academicPrograms.inactive.map((program) => (
                      <div
                        key={program.id}
                        className="p-4 rounded-lg border border-dashed transition-all hover:border-primary/20 hover:shadow-sm bg-muted/30"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 mr-4 space-y-1 min-w-0">
                            <div className="flex flex-wrap gap-2 items-center">
                              <h4 className="font-medium transition-colors text-muted-foreground group-hover:text-primary">
                                {program.name}
                              </h4>
                              <Badge variant="outline" className="text-xs">
                                {program.abbreviation}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {program.description}
                            </p>
                          </div>
                          <div className="flex gap-2 items-center shrink-0">
                            <UsersIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">
                              {program.totalStudents}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
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
          </Card>
        </div>

        {/* Banner Programs */}
        <div className="lg:col-span-1">
          <Card>
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Banner Programs</h2>
              <p className="text-sm text-muted-foreground">
                Featured extension programs
              </p>
            </div>
            <div className="p-6 space-y-4">
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
                      <h3 className="text-lg font-semibold">{program.name}</h3>
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
        <Card>
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Upcoming Activities</h2>
                <p className="text-sm text-muted-foreground">
                  Scheduled activities and events
                </p>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </div>
          <div className="p-6">
            {departmentData.activities.filter(
              (activity) => new Date(activity.targetDate) > new Date()
            ).length > 0 ? (
              <div className="space-y-4">
                {departmentData.activities
                  .filter(
                    (activity) => new Date(activity.targetDate) > new Date()
                  )
                  .map((activity) => (
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
                        <Badge variant="outline">
                          {new Date(activity.targetDate).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center p-8 text-center">
                <CalendarClock className="mb-4 w-12 h-12 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold">
                  No Upcoming Activities
                </h3>
                <p className="text-sm text-muted-foreground">
                  There are no scheduled activities at the moment.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Completed Activities */}
        <Card>
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Completed Activities</h2>
                <p className="text-sm text-muted-foreground">
                  Past activities and events
                </p>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </div>
          <div className="p-6">
            {departmentData.activities.filter(
              (activity) => new Date(activity.targetDate) <= new Date()
            ).length > 0 ? (
              <div className="space-y-4">
                {departmentData.activities
                  .filter(
                    (activity) => new Date(activity.targetDate) <= new Date()
                  )
                  .map((activity) => (
                    <div
                      key={activity.id}
                      className="p-4 rounded-lg border border-dashed transition-all hover:border-primary/20 hover:shadow-sm bg-muted/30"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 mr-4 space-y-1 min-w-0">
                          <h4 className="font-medium text-muted-foreground">
                            {activity.title}
                          </h4>
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
                          {activity.partnerCommunity && (
                            <div className="flex gap-2 items-center mt-2">
                              <span className="text-sm text-muted-foreground">
                                Partner: {activity.partnerCommunity.name}
                              </span>
                            </div>
                          )}
                        </div>
                        <Badge variant="outline">
                          {new Date(activity.targetDate).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center p-8 text-center">
                <CalendarCheck className="mb-4 w-12 h-12 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold">
                  No Completed Activities
                </h3>
                <p className="text-sm text-muted-foreground">
                  There are no completed activities to display.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
