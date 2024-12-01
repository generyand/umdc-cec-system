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
  Target,
  FolderPlus,
  FileBarChart,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function HomePage() {
  const { user } = useAuth();

  const quickActions = [
    {
      label: "Create Proposal",
      href: "/admin/proposals/new",
      icon: FileText,
    },
    {
      label: "Submit Report",
      href: "/admin/reports/new",
      icon: FileBarChart,
    },
    {
      label: "Schedule Event",
      href: "/admin/calendar",
      icon: Calendar,
    },
    {
      label: "View Guidelines",
      href: "/admin/guidelines",
      icon: FolderPlus,
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

  const quickLinks = [
    {
      title: "Extension Manual",
      description: "Guidelines and procedures",
      href: "/documents/manual",
      icon: FileText,
    },
    {
      title: "Forms & Templates",
      description: "Downloadable resources",
      href: "/documents/templates",
      icon: FolderPlus,
    },
    {
      title: "Calendar",
      description: "Extension activities schedule",
      href: "/calendar",
      icon: Calendar,
    },
    {
      title: "Reports Dashboard",
      description: "View and generate reports",
      href: "/reports",
      icon: FileBarChart,
    },
  ];

  return (
    <div className="p-6 mx-auto space-y-8 w-full">
      {/* Welcome Section - Enhanced with better visual hierarchy */}
      <div className="flex flex-col gap-4 justify-between items-start p-6 bg-gradient-to-r to-transparent rounded-lg md:flex-row md:items-center from-primary/10">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            {user?.department?.abbreviation} | Community Extension Center
          </p>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant={
                action.label === "Create Proposal" ? "default" : "secondary"
              }
              className="transition-all hover:scale-105"
              onClick={() => console.log(`Navigate to ${action.href}`)}
            >
              <action.icon className="mr-2 w-4 h-4" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Recent Activity - Enhanced with better scrolling and interaction */}
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

        {/* Announcements - Enhanced with better priority visualization */}
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

        {/* Quick Links - Enhanced with better interaction and visual feedback */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <FileText className="w-5 h-5 text-primary" />
              Quick Links
            </CardTitle>
            <CardDescription>Frequently accessed resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickLinks.map((link) => (
                <Button
                  key={link.title}
                  variant="outline"
                  className="flex flex-col items-start p-6 space-y-3 h-auto transition-colors hover:bg-primary/5 hover:border-primary"
                  onClick={() => console.log(`Navigate to ${link.href}`)}
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <link.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{link.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {link.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
