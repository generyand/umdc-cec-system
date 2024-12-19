import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  Target,
  FolderPlus,
  Calendar,
  Building2,
  AlertCircle,
  FilePlus,
  BookOpen,
  UserCircle,
  Clock,
  GraduationCap,
  CalendarDays,
  TrendingUp,
  Users,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { UserPosition } from "@/types/user.types";
import { dashboardApi } from "@/services/api/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";

interface DashboardOverview {
  data: {
    recentActivities: {
      id: string;
      title: string;
      targetDate: string;
      department: {
        name: string;
        abbreviation: string;
      };
    }[];
    announcements: {
      id: string;
      title: string;
      content: string;
      status: string;
      createdAt: string;
    }[];
    departments: {
      id: string;
      name: string;
      abbreviation: string;
      _count: {
        activities: number;
        projectProposals: number;
      };
    }[];
    pendingApprovals: {
      id: string;
      title: string;
      status: string;
      currentApprovalStep: number;
      createdAt: string;
      user: {
        firstName: string;
        lastName: string;
      };
    }[];
  };
}

export default function HomePage() {
  const { user, currentSchoolYear } = useAuth();
  const navigate = useNavigate();

  const { data: dashboardStatsData, isLoading: isDashboardStatsLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => dashboardApi.getDashboardStats(),
  });

  const dashboardStats = dashboardStatsData?.data;

  console.log(dashboardStats);

  const { data: dashboardOverview, isLoading: isDashboardOverviewLoading } = useQuery<DashboardOverview>({
    queryKey: ["dashboardOverview"],
    queryFn: () => dashboardApi.getDashboardOverview(),
  });

  const overview = dashboardOverview?.data;

  console.log(overview);


  const formatPosition = (position: UserPosition) => {
    if (position === UserPosition.CEC_HEAD) {
      return "Community Extension Center Head";
    } else if (position === UserPosition.VP_DIRECTOR) {
      return "VP Director";
    } else if (position === UserPosition.CHIEF_OPERATION_OFFICER) {
      return "Chief Operation Officer";
    }
    return position;
  };

  const quickLinks = [
    {
      title: "Extension Manual",
      description: "Guidelines and procedures",
      href: "/admin/documents/manual",
      icon: BookOpen,
    },

    {
      title: "Calendar",
      description: "Extension activities schedule",
      href: "/admin/events-and-activities/calendar",
      icon: Calendar,
    },
  ];

  return (
    <div className="mx-auto space-y-8 w-full">
      {/* Welcome Section with Stats */}
      <div className="space-y-6">
        {/* Welcome Banner with Gradient Overlay */}
        <div className="relative bg-primary rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary"></div>
          
          {/* Content Container */}
          <div className="relative px-8 py-6">
            {/* Top Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Welcome Text & User Info */}
              <div className="flex items-center gap-4">
                <div className="hidden md:flex h-12 w-12 rounded-full bg-white/10 items-center justify-center">
                  <UserCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-primary-foreground"> Welcome back, {user?.firstName} 👋</h1>
                  <p className="text-sm text-primary-foreground/80">{user?.department?.name || formatPosition(user?.position as UserPosition)}</p>
                </div>
              </div>

              {/* Date & School Year Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm text-primary-foreground/80">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date().toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                  <GraduationCap className="w-4 h-4" />
                  <span>SY {currentSchoolYear?.year || "Not set"}</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {/* Banner Programs */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/15 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary-foreground/70">
                      Banner Programs
                    </p>
                    <p className="text-2xl font-bold text-primary-foreground mt-1">{dashboardStats?.bannerProgramsCount || 0}</p>
                  </div>
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Target className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-primary-foreground/60">
                  <TrendingUp className="w-3 h-3" />
                  <span>2 new this month</span>
                </div>
              </div>

              {/* Partner Communities */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/15 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary-foreground/70">
                      Partner Communities
                    </p>
                    <p className="text-2xl font-bold text-primary-foreground mt-1">{dashboardStats?.partnerCommunitiesCount || 0}</p>
                  </div>
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Building2 className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-primary-foreground/60">
                  <Users className="w-3 h-3" />
                  <span>Active partnerships</span>
                </div>
              </div>

              {/* Active Projects */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/15 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary-foreground/70">
                      Active Projects
                    </p>
                    <p className="text-2xl font-bold text-primary-foreground mt-1">{dashboardStats?.activeProjectsCount || 0}</p>
                  </div>
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Activity className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-primary-foreground/60">
                  <Clock className="w-3 h-3" />
                  <span>In progress</span>
                </div>
              </div>

              {/* Upcoming Activities */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/15 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary-foreground/70">
                      Upcoming Activities
                    </p>
                    <p className="text-2xl font-bold text-primary-foreground mt-1">{dashboardStats?.upcomingActivitiesCount || 0}</p>
                  </div>
                  <div className="p-2 bg-white/10 rounded-lg">
                    <CalendarDays className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-primary-foreground/60">
                  <Calendar className="w-3 h-3" />
                  <span>This month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links - Moved to top */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => (
          <Button
            key={link.title}
            variant="outline"
            className="group flex flex-col items-start p-6 space-y-3 h-auto rounded-lg transition-all duration-300 hover:scale-102 hover:shadow-md border-muted-foreground/20"
            onClick={() => navigate(link.href)}
          >
            <div className="p-3 rounded-full bg-primary/10 transition-colors duration-300 group-hover:bg-primary/10">
              <link.icon className="w-6 h-6 text-primary transition-colors duration-300 group-hover:text-primary/80" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-primary/90 transition-colors duration-300 group-hover:text-primary">
                {link.title}
              </div>
              <div className="mt-1 text-sm text-muted-foreground/80">
                {link.description}
              </div>
            </div>
          </Button>
        ))}
      </div>

      {/* Rest of your dashboard content */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Recent Activity Card */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle className="flex gap-2 items-center">
                <Activity className="w-5 h-5 text-primary" />
                Activities
              </CardTitle>
              <CardDescription>Latest updates and events</CardDescription>
            </div>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {overview?.recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start p-4 space-x-4 text-sm rounded-lg transition-colors hover:bg-muted/50"
                  >
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-primary">
                          {activity.title}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {activity.department.abbreviation}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(activity.targetDate), "PPP")} at {format(new Date(activity.targetDate), "p")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Announcements Card */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle className="flex gap-2 items-center">
                <Target className="w-5 h-5 text-primary" />
                Announcements
              </CardTitle>
              <CardDescription>Important updates and notices</CardDescription>
            </div>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {overview?.announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="p-4 rounded-lg border transition-colors hover:bg-muted/50"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="font-medium leading-none">{announcement.title}</h4>
                        <Badge variant="outline" className="shrink-0">
                          {announcement.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {announcement.content}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Department Overview Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex gap-2 items-center">
                  <Building2 className="w-5 h-5 text-primary" />
                  Department Overview
                </CardTitle>
                <CardDescription>Program statistics by department</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {overview?.departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="p-4 rounded-lg border transition-colors hover:bg-muted/50"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{dept.name}</h4>
                          <p className="text-sm text-muted-foreground">{dept.abbreviation}</p>
                        </div>
                        <Badge 
                          variant="outline"
                          className={cn(
                            "capitalize",
                            dept._count.activities > 0 ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                          )}
                        >
                          {dept._count.activities > 0 ? "Active" : "No Activities"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <span>{dept._count.activities} Activities</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FilePlus className="h-4 w-4 text-muted-foreground" />
                          <span>{dept._count.projectProposals} Proposals</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Pending Approvals Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex gap-2 items-center">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  Pending Approvals
                </CardTitle>
                <CardDescription>Proposals awaiting your review</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {overview?.pendingApprovals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                    <CheckCircle className="h-8 w-8 mb-2" />
                    <p>No pending approvals</p>
                  </div>
                ) : (
                  overview?.pendingApprovals.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-lg border transition-colors hover:bg-muted/50 cursor-pointer"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-medium">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              By {item.user.firstName} {item.user.lastName}
                            </p>
                          </div>
                          <Badge variant="secondary" className="shrink-0">
                            Step {item.currentApprovalStep}
                          </Badge>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
