import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { departmentsApi } from "@/services/api/departments.service";
import { DepartmentSkeleton } from "@/components/admin/academic-departments/department-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  UsersIcon,
  ArchiveIcon,
  FlagIcon,
  ClipboardListIcon,
  CalendarCheck,
  CalendarClock,
  ChevronRight,
  Calendar,
  FileText,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import * as DepartmentLogos from "@/assets/images/department-logos";

// Add logo mapping
const departmentLogoMap: {[key: string]: string} = {
  DAE: DepartmentLogos.DAELogo,
  DASE: DepartmentLogos.DASELogo,
  DBA: DepartmentLogos.DBALogo,
  DCJE: DepartmentLogos.DCJELogo,
  DTE: DepartmentLogos.DTELogo,
  DTP: DepartmentLogos.DTPLogo,
  SHS: DepartmentLogos.SHSLogo,
};

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

  const activeActivitiesCount = departmentData.activities.filter(
    activity => activity.status !== "CANCELLED"
  ).length;

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
      value: activeActivitiesCount,
      unit: "activities",
    },
  ];

  function ActivityCard({ activity }: { activity: any }) {
    const navigate = useNavigate();

    const getBadgeVariant = (status: string) => {
      switch (status) {
        case "UPCOMING":
          return "default";
        case "ONGOING":
          return "secondary";
        case "COMPLETED":
          return "success";
        default:
          return "default";
      }
    };

    return (
      <Card 
        className="overflow-hidden transition-all hover:shadow-md cursor-pointer group"
        onClick={() => navigate(`/admin/events-and-activities/activity-management/${activity.id}`)}
      >
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <Badge 
                variant={getBadgeVariant(activity.status)}
                className="w-fit"
              >
                {activity.status}
              </Badge>
            </div>

            {/* Title */}
            <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
              {activity.title}
            </h4>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {activity.description}
            </p>

            {/* Banner Program (if exists) */}
            {activity.bannerProgram && (
              <div className="flex items-start gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{activity.bannerProgram.abbreviation}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.bannerProgram.name}
                  </p>
                </div>
              </div>
            )}

            {/* Partner Community */}
            {activity.partnerCommunity && (
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{activity.partnerCommunity.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.partnerCommunity.address}
                  </p>
                </div>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {new Date(activity.targetDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto space-y-8 w-full">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-muted-foreground">
        <Link
          to="/admin/academic-departments"
          className="transition-colors hover:text-foreground"
        >
          Academic Departments
        </Link>
        <ChevronRight className="mx-2 w-4 h-4" />
        <span className="font-medium text-foreground">
          {departmentData.department.name}
        </span>
      </nav>

      {/* Replace the header section */}
      <div className="relative overflow-hidden rounded-lg border bg-gradient-to-r from-card to-primary/5">
        <div className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
          {/* Left Section: Logo and Department Info */}
          <div className="flex items-start gap-8">
            {/* Department Logo */}
            {departmentData?.department.abbreviation && departmentLogoMap[departmentData.department.abbreviation] && (
              <div className="relative flex shrink-0 items-center justify-center bg-white min-w-[100px] min-h-[100px] max-h-[100px]">
                <img
                  src={departmentLogoMap[departmentData.department.abbreviation]}
                  alt={`${departmentData.department.abbreviation} Logo`}
                  className="w-full h-24 object-contain transition-transform hover:scale-105"
                />
              </div>
            )}
            
            {/* Department Information */}
            <div className="space-y-4">
              <div className="space-y-2 flex gap-4 items-center">
                <h1 className="text-3xl font-bold tracking-tight">
                  {departmentData.department.name}
                </h1>
                <Badge 
                  variant="secondary" 
                  className="px-3 py-1 text-sm font-medium bg-secondary text-gray-900 hover:bg-secondary/15"
                >
                  {departmentData.department.abbreviation}
                </Badge>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground max-w-[600px]">
                {departmentData.department.description}
              </p>
            </div>
          </div>

          
        </div>
        
        {/* Decorative gradient */}
        <div className="absolute right-0 top-0 -z-10 h-full w-1/2 bg-gradient-to-l from-secondary/10 to-transparent" />
      </div>

      {/* Update Quick Stats styling */}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex gap-4 items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-lg shrink-0",
                  stat.iconBgColor,
                  "transition-colors duration-200"
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

      {/* Update Banner Programs styling */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Keep Academic Programs section, just update the card styling */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <div className="flex-shrink-0 p-6 border-b">
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
                                <UsersIcon className="w-4 h-4 text-muted-foreground" />
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

        {/* Update Banner Programs styling */}
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
                  className="p-4 text-primary-foreground bg-gradient-to-br from-primary to-primary/80 rounded-lg shadow-sm hover:shadow-md transition-all"
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
                      className="text-white bg-secondary/80 shrink-0"
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

      {/* Update Activities section styling */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Update activity cards with new styling */}
        <Card className="h-[600px] flex flex-col">
          <div className="flex-shrink-0 p-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex gap-2 items-center">
                  <h2 className="text-xl font-semibold">Upcoming Activities</h2>
                  <span className="px-2 py-0.5 text-xs font-medium text-muted-foreground bg-muted rounded-full">
                    {departmentData.activities.filter(activity => activity.status === "UPCOMING").length}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Scheduled activities and events
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-6 scrollbar-thin">
            {departmentData.activities.filter(activity => activity.status === "UPCOMING").length > 0 ? (
              <div className="space-y-4">
                {departmentData.activities
                  .filter(activity => activity.status === "UPCOMING")
                  .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
                  .map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center p-8 text-center">
                <CalendarClock className="mb-4 w-12 h-12 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold">No Upcoming Activities</h3>
                <p className="text-sm text-muted-foreground">
                  There are no scheduled activities at the moment.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Ongoing Activities */}
        <Card className="h-[600px] flex flex-col">
          <div className="flex-shrink-0 p-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex gap-2 items-center">
                  <h2 className="text-xl font-semibold">Ongoing Activities</h2>
                  <span className="px-2 py-0.5 text-xs font-medium text-muted-foreground bg-muted rounded-full">
                    {departmentData.activities.filter(activity => activity.status === "ONGOING").length}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Currently running activities
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-6 scrollbar-thin">
            {departmentData.activities.filter(activity => activity.status === "ONGOING").length > 0 ? (
              <div className="space-y-4">
                {departmentData.activities
                  .filter(activity => activity.status === "ONGOING")
                  .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
                  .map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center p-8 text-center">
                <CalendarClock className="mb-4 w-12 h-12 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold">No Ongoing Activities</h3>
                <p className="text-sm text-muted-foreground">
                  There are no activities currently in progress.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Completed Activities */}
        <Card className="h-[600px] flex flex-col">
          <div className="flex-shrink-0 p-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex gap-2 items-center">
                  <h2 className="text-xl font-semibold">Completed Activities</h2>
                  <span className="px-2 py-0.5 text-xs font-medium text-muted-foreground bg-muted rounded-full">
                    {departmentData.activities.filter(activity => activity.status === "COMPLETED").length}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Past activities and events
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-6 scrollbar-thin">
            {departmentData.activities.filter(activity => activity.status === "COMPLETED").length > 0 ? (
              <div className="space-y-4">
                {departmentData.activities
                  .filter(activity => activity.status === "COMPLETED")
                  .sort((a, b) => new Date(b.targetDate).getTime() - new Date(a.targetDate).getTime())
                  .map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center p-8 text-center">
                <CalendarCheck className="mb-4 w-12 h-12 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold">No Completed Activities</h3>
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
