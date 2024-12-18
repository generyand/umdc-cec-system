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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  const { user, currentSchoolYear } = useAuth();
  const navigate = useNavigate();

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

  const recentActivity = [
    {
      user: "Dr. Santos",
      action: "submitted a new proposal for",
      project: "Community Health Initiative",
      time: "2 hours ago",
      department: "College of Nursing",
    },
    {
      user: "Prof. Garcia",
      action: "updated the status of",
      project: "Digital Literacy Program",
      time: "4 hours ago",
      department: "College of Computing",
    },
    {
      user: "Dean Reyes",
      action: "approved the proposal for",
      project: "Youth Development Workshop",
      time: "5 hours ago",
      department: "College of Education",
    },
  ];

  const announcements = [
    {
      title: "Proposal Deadline Extension",
      content:
        "Extension program proposals for Q2 2024 deadline extended to April 15",
      date: "March 25, 2024",
      priority: "high",
    },
    {
      title: "New Reporting Guidelines",
      content: "Updated impact assessment templates now available",
      date: "March 23, 2024",
      priority: "medium",
    },
    {
      title: "System Maintenance",
      content: "Scheduled maintenance on March 30, 2024, from 10 PM to 2 AM",
      date: "March 22, 2024",
      priority: "low",
    },
  ];

  const departmentPerformance = [
    {
      name: "DAE",
      fullName: "Department of Accounting Education",
      programs: 6,
      participation: 88,
      status: "active",
      activePrograms: [
        "Financial Literacy Workshop",
        "Basic Bookkeeping for SMEs",
      ],
    },
    // Add 2-3 more departments for initial display
  ];

  const pendingApprovals = [
    {
      id: 1,
      title: "Community Financial Education Workshop",
      department: "DAE",
      submittedBy: "Prof. Garcia",
      status: "pending_review",
      submitDate: "2024-03-20",
    },
    // Add 2-3 more items for initial display
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
                  <p className="text-sm text-primary-foreground/80">{user?.department?.name || user?.position}</p>
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
                    <p className="text-2xl font-bold text-primary-foreground mt-1">4</p>
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
                    <p className="text-2xl font-bold text-primary-foreground mt-1">5</p>
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
                    <p className="text-2xl font-bold text-primary-foreground mt-1">12</p>
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
                    <p className="text-2xl font-bold text-primary-foreground mt-1">8</p>
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
                Recent Activities
              </CardTitle>
              <CardDescription>Latest updates and events</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start p-3 space-x-3 text-sm rounded-lg transition-colors hover:bg-muted/50"
                  >
                    <div className="mt-2 w-2 h-2 rounded-full bg-primary shrink-0" />
                    <div>
                      <p className="leading-relaxed">
                        <span className="font-semibold text-primary">
                          {activity.user}
                        </span>{" "}
                        {activity.action}{" "}
                        <span className="font-medium cursor-pointer hover:text-primary">
                          {activity.project}
                        </span>
                      </p>
                      <div className="flex gap-2 items-center mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {activity.department}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {activity.time}
                        </span>
                      </div>
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
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {announcements.map((announcement, index) => (
                  <div
                    key={index}
                    className={cn(
                      "space-y-2 p-4 rounded-lg transition-colors",
                      "hover:bg-muted/50",
                      announcement.priority === "high" &&
                        "border-l-4 border-red-500",
                      announcement.priority === "medium" &&
                        "border-l-4 border-yellow-500",
                      announcement.priority === "low" &&
                        "border-l-4 border-green-500"
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{announcement.title}</h4>
                      <Badge
                        variant={
                          announcement.priority === "high"
                            ? "destructive"
                            : announcement.priority === "medium"
                            ? "secondary"
                            : "outline"
                        }
                        className={cn(
                          announcement.priority === "high" && "bg-red-500",
                          announcement.priority === "medium" && "bg-yellow-500",
                          announcement.priority === "low" && "bg-green-500",
                          "text-white"
                        )}
                      >
                        {announcement.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {announcement.content}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {announcement.date}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Department Performance Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex gap-2 items-center">
                  <Building2 className="w-5 h-5 text-primary" />
                  Department Overview
                </CardTitle>
                <CardDescription>
                  Active programs and participation
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {departmentPerformance.map((dept) => (
                  <div
                    key={dept.name}
                    className="p-4 space-y-3 rounded-lg transition-colors hover:bg-muted/50"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex gap-2 items-center">
                          <span className="font-medium">{dept.name}</span>
                          <Badge variant="outline">
                            {dept.programs} programs
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {dept.fullName}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "capitalize",
                          dept.status === "active" &&
                            "bg-green-500/10 text-green-500"
                        )}
                      >
                        {dept.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Active Programs:</p>
                      <div className="flex flex-wrap gap-2">
                        {dept.activePrograms.map((program) => (
                          <Badge
                            key={program}
                            variant="outline"
                            className="text-xs"
                          >
                            {program}
                          </Badge>
                        ))}
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
                <CardDescription>Items requiring attention</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {pendingApprovals.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-lg transition-colors cursor-pointer hover:bg-muted/50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="font-medium">{item.title}</p>
                        <div className="flex gap-2 items-center text-sm">
                          <Badge variant="outline">{item.department}</Badge>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">
                            {item.submittedBy}
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary">Pending Review</Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Submitted on {formatDate(item.submitDate)}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
