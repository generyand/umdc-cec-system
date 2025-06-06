import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  FileText,
  Calendar,
  ClipboardList,
  BookOpen,
  Target,
  UserCircle,
  GraduationCap,
  CalendarDays,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { UserPosition } from "@/types/user.types";

export default function StaffHomePage() {
  const { user, currentSchoolYear } = useAuth();
  const navigate = useNavigate();

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
      title: "Create Proposal",
      description: "Submit new extension proposal",
      href: "/staff/proposals/new",
      icon: FileText,
    },
    {
      title: "Forms & Templates",
      description: "View and manage your projects",
      href: "/staff/documents/forms-and-templates",
      icon: ClipboardList,
    },
    {
      title: "Extension Manual",
      description: "Guidelines and procedures",
      href: "/staff/documents/manual",
      icon: BookOpen,
    },
    {
      title: "Calendar",
      description: "View upcoming activities",
      href: "/staff/calendar",
      icon: Calendar,
    },
  ];

  const myActivities = [
    {
      title: "Community Health Workshop",
      status: "ongoing",
      nextActivity: "Session 3: Health Education",
      date: "2024-04-01",
    },
    {
      title: "Youth Mentoring Program",
      status: "upcoming",
      nextActivity: "Orientation Meeting",
      date: "2024-04-05",
    },
  ];

  const announcements = [
    {
      title: "Monthly Report Due",
      content: "Please submit your March 2024 activity reports by April 5",
      date: "March 25, 2024",
      priority: "high",
    },
    {
      title: "Training Workshop",
      content: "Mandatory project management training on April 10",
      date: "March 23, 2024",
      priority: "medium",
    },
  ];

  return (
    <div className="mx-auto space-y-8 w-full">
      {/* Welcome Section */}
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {/* Active Projects */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/15 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary-foreground/70">
                      Active Projects
                    </p>
                    <p className="text-2xl font-bold text-primary-foreground mt-1">3</p>
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

              {/* Pending Reports */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/15 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary-foreground/70">
                      Academic Programs
                    </p>
                    <p className="text-2xl font-bold text-primary-foreground mt-1">2</p>
                  </div>
                  <div className="p-2 bg-white/10 rounded-lg">
                    <FileText className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-primary-foreground/60">
                  <AlertCircle className="w-3 h-3" />
                  <span>Active programs</span>
                </div>
              </div>

              {/* Upcoming Activities */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/15 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary-foreground/70">
                      Upcoming Activities
                    </p>
                    <p className="text-2xl font-bold text-primary-foreground mt-1">5</p>
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

      {/* Quick Links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => (
          <Button
            key={link.title}
            variant="outline"
            className="group flex flex-col items-start p-6 space-y-3 h-auto rounded-lg transition-all duration-300 hover:scale-102 hover:shadow-md border-muted-foreground/20"
            onClick={() => navigate(link.href)}
          >
            <div className="p-3 rounded-full bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
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

      {/* Dashboard Content */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* My Activities Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex gap-2 items-center">
                  <Activity className="w-5 h-5 text-primary" />
                  My Activities
                </CardTitle>
                <CardDescription>
                  Your ongoing and upcoming activities
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
                {myActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="p-4 space-y-3 rounded-lg transition-colors hover:bg-muted/50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.nextActivity}
                        </p>
                      </div>
                      <Badge
                        variant={
                          activity.status === "ongoing"
                            ? "default"
                            : "secondary"
                        }
                        className={cn(
                          "capitalize",
                          activity.status === "ongoing" &&
                            "bg-primary/10 text-primary"
                        )}
                      >
                        {activity.status}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Next activity on {formatDate(activity.date)}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Announcements Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex gap-2 items-center">
                  <Target className="w-5 h-5 text-primary" />
                  Announcements
                </CardTitle>
                <CardDescription>Important updates and notices</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
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
      </div>
    </div>
  );
}
