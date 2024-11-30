import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  Users,
  FileText,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  FolderPlus,
  UserPlus,
  FileBarChart,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Active Programs",
      value: "12",
      change: "+3",
      trend: "up",
      icon: Activity,
    },
    {
      title: "Total Beneficiaries",
      value: "1,234",
      change: "+15.2%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Ongoing Projects",
      value: "8",
      change: "+2",
      trend: "up",
      icon: FileText,
    },
    {
      title: "Impact Score",
      value: "92%",
      change: "+4.3%",
      trend: "up",
      icon: Target,
    },
  ];

  const recentActivity = [
    {
      user: "Dr. Santos",
      action: "created a new extension program",
      project: "Community Health Initiative",
      time: "2 hours ago",
    },
    {
      user: "Prof. Garcia",
      action: "submitted impact assessment for",
      project: "Digital Literacy Program",
      time: "4 hours ago",
    },
    {
      user: "Ms. Reyes",
      action: "updated resource allocation for",
      project: "Youth Development Workshop",
      time: "5 hours ago",
    },
  ];

  const quickActions = [
    {
      label: "Create Program",
      href: "/admin/programs/new",
      icon: FolderPlus,
    },
    {
      label: "Add Focal Person",
      href: "/admin/users/new",
      icon: UserPlus,
    },
    {
      label: "Generate Report",
      href: "/admin/reports",
      icon: FileBarChart,
    },
    {
      label: "Schedule Activity",
      href: "/admin/calendar",
      icon: Calendar,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.firstName}
        </h1>
        <p className="text-muted-foreground">
          Monitor and manage community extension programs at UM Digos College
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
                <div
                  className={`flex items-center space-x-1 text-sm ${
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates on extension programs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 text-sm">
                  <div className="mt-2 w-2 h-2 rounded-full bg-primary" />
                  <div>
                    <p>
                      <span className="font-medium">{activity.user}</span>{" "}
                      {activity.action}{" "}
                      <span className="font-medium">{activity.project}</span>
                    </p>
                    <p className="text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="justify-start w-full"
                  onClick={() => console.log(`Navigate to ${action.href}`)}
                >
                  <action.icon className="mr-2 w-4 h-4" />
                  {action.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
