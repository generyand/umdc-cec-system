import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Activity, Building2, Target, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Sample data - Replace with actual API calls
const statsData = {
  activePrograms: 32,
  ongoingProjects: 24,
  completedPrograms: 48,
  volunteers: 245,
  activeGrowth: "+15%",
  ongoingGrowth: "+10%",
  completedGrowth: "+18%",
  volunteersGrowth: "+22%",
};

const departmentParticipation = [
  {
    name: "DAE",
    fullName: "Department of Accounting Education",
    programs: 6,
    participation: 88,
    success: 92,
    activePrograms: [
      "Financial Literacy Workshop",
      "Basic Bookkeeping for SMEs",
    ],
  },
  {
    name: "DASE",
    fullName: "Department of Arts & Sciences Education",
    programs: 8,
    participation: 85,
    success: 90,
    activePrograms: [
      "Community Science Fair",
      "Environmental Awareness Campaign",
    ],
  },
  {
    name: "DBA",
    fullName: "Department of Business Administration",
    programs: 7,
    participation: 82,
    success: 88,
    activePrograms: ["Entrepreneurship Training", "Small Business Mentoring"],
  },
  {
    name: "DCJE",
    fullName: "Department of Criminal Justice Education",
    programs: 5,
    participation: 90,
    success: 94,
    activePrograms: ["Community Safety Seminar", "Youth Crime Prevention"],
  },
  {
    name: "DTE",
    fullName: "Department of Teacher Education",
    programs: 9,
    participation: 95,
    success: 96,
    activePrograms: ["Literacy Program", "Teaching Skills Workshop"],
  },
  {
    name: "DTP",
    fullName: "Department of Technical Programs",
    programs: 7,
    participation: 86,
    success: 89,
    activePrograms: ["Technical Skills Training", "Computer Literacy Program"],
  },
  {
    name: "SHS",
    fullName: "Senior High School",
    programs: 4,
    participation: 92,
    success: 93,
    activePrograms: ["Youth Development Program", "Academic Tutorial"],
  },
  {
    name: "NTP",
    fullName: "Non-teaching Personnel",
    programs: 3,
    participation: 80,
    success: 85,
    activePrograms: ["Staff Development Program"],
  },
  {
    name: "Alumni",
    fullName: "Alumni Association",
    programs: 5,
    participation: 75,
    success: 87,
    activePrograms: ["Career Mentoring", "Alumni Giving Program"],
  },
];

const monthlyTrends = [
  { month: "Jan", programs: 18, participants: 180, impact: 88 },
  { month: "Feb", programs: 22, participants: 210, impact: 90 },
  { month: "Mar", programs: 25, participants: 245, impact: 92 },
  { month: "Apr", programs: 28, participants: 260, impact: 91 },
  { month: "May", programs: 32, participants: 285, impact: 94 },
];

const pendingApprovals = [
  {
    id: 1,
    title: "Community Financial Education Workshop",
    department: "DAE",
    submittedBy: "Prof. Garcia",
    status: "pending_review",
    submitDate: "2024-03-20",
    description:
      "Workshop aimed at improving financial literacy in local communities",
  },
  {
    id: 2,
    title: "Environmental Science Outreach",
    department: "DASE",
    submittedBy: "Dr. Santos",
    status: "pending_review",
    submitDate: "2024-03-18",
    description: "Science education program for public schools",
  },
  {
    id: 3,
    title: "Small Business Development Program",
    department: "DBA",
    submittedBy: "Prof. Reyes",
    status: "pending_review",
    submitDate: "2024-03-15",
    description: "Mentoring program for local entrepreneurs",
  },
];

const programTimelines = [
  {
    id: 1,
    name: "Literacy Enhancement Program",
    department: "DTE",
    progress: 75,
    startDate: "2024-02-01",
    endDate: "2024-06-30",
    status: "on_track",
    coordinator: "Dr. Cruz",
    participants: 45,
  },
  {
    id: 2,
    name: "Community Safety Awareness",
    department: "DCJE",
    progress: 60,
    startDate: "2024-03-01",
    endDate: "2024-07-31",
    status: "on_track",
    coordinator: "Prof. Mendoza",
    participants: 38,
  },
  {
    id: 3,
    name: "Digital Skills Training",
    department: "DTP",
    progress: 40,
    startDate: "2024-03-15",
    endDate: "2024-08-15",
    status: "on_track",
    coordinator: "Prof. Lim",
    participants: 52,
  },
  {
    id: 4,
    name: "Youth Mentoring Program",
    department: "SHS",
    progress: 30,
    startDate: "2024-04-01",
    endDate: "2024-09-30",
    status: "on_track",
    coordinator: "Ms. Santos",
    participants: 65,
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6 mx-auto space-y-8 w-full">
      {/* Page Header with Quick Stats */}
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground">
            Monitor and analyze your community extension programs
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="transition-all hover:shadow-lg hover:border-primary/50">
            <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Active Programs
              </CardTitle>
              <div className="p-2 rounded-full bg-primary/10">
                <Activity className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-3xl font-bold">
                    {statsData.activePrograms}
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="font-medium text-green-500">
                      {statsData.activeGrowth}
                    </span>
                    <span className="ml-1 text-muted-foreground">
                      vs. last month
                    </span>
                  </div>
                </div>
                <div className="w-16 h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrends.slice(-5)}>
                      <Line
                        type="monotone"
                        dataKey="programs"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Add other stat cards with similar pattern */}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Trends Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex gap-2 items-center">
                  <Activity className="w-5 h-5 text-primary" />
                  Monthly Activity Trends
                </CardTitle>
                <CardDescription>
                  Program and participation overview
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Export Data
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrends}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="programs" fill="#2563eb" name="Programs" />
                  <Bar
                    dataKey="participants"
                    fill="#16a34a"
                    name="Participants"
                  />
                  <Line
                    type="monotone"
                    dataKey="impact"
                    stroke="#dc2626"
                    name="Impact Score"
                    strokeWidth={2}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex gap-2 items-center">
                  <Building2 className="w-5 h-5 text-primary" />
                  Department Performance
                </CardTitle>
                <CardDescription>
                  Program participation and success rates
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                {departmentParticipation.map((dept) => (
                  <div
                    key={dept.name}
                    className="p-4 space-y-3 rounded-lg transition-colors hover:bg-muted/50"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{dept.name}</span>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">
                            {dept.programs} programs
                          </Badge>
                          <Badge
                            variant="outline"
                            className={cn(
                              "bg-primary/10",
                              dept.success >= 90 &&
                                "bg-green-500/10 text-green-500",
                              dept.success >= 80 &&
                                dept.success < 90 &&
                                "bg-yellow-500/10 text-yellow-500",
                              dept.success < 80 && "bg-red-500/10 text-red-500"
                            )}
                          >
                            {dept.success}% success rate
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Participation Rate</span>
                        <span className="font-medium">
                          {dept.participation}%
                        </span>
                      </div>
                      <Progress
                        value={dept.participation}
                        className={cn(
                          "h-2",
                          dept.participation >= 90 && "[&>div]:bg-green-500",
                          dept.participation >= 80 &&
                            dept.participation < 90 &&
                            "[&>div]:bg-yellow-500",
                          dept.participation < 80 && "[&>div]:bg-red-500"
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Status Overview */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex gap-2 items-center">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  Status Overview
                </CardTitle>
                <CardDescription>
                  Recent updates and pending items
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-6">
                {/* Pending Approvals Section */}
                <div>
                  <h4 className="mb-3 text-sm font-medium">
                    Pending Approvals
                  </h4>
                  <div className="space-y-3">
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
                        <div className="mt-2 text-xs text-muted-foreground">
                          Submitted on{" "}
                          {new Date(item.submitDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Program Timelines Section */}
                <div>
                  <h4 className="mb-3 text-sm font-medium">Active Programs</h4>
                  <div className="space-y-3">
                    {programTimelines.map((program) => (
                      <div
                        key={program.id}
                        className="p-4 rounded-lg transition-colors cursor-pointer hover:bg-muted/50"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="font-medium">{program.name}</p>
                            <div className="flex gap-2 items-center text-sm">
                              <Badge variant="outline">{program.status}</Badge>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-muted-foreground">
                                {program.startDate} - {program.endDate}
                              </span>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {program.progress}% progress
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Resource Allocation */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex gap-2 items-center">
                <Target className="w-5 h-5 text-primary" />
                Resource Allocation
              </CardTitle>
              <CardDescription>
                Distribution of resources across departments
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentParticipation}
                  dataKey="programs"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {departmentParticipation.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`hsl(${index * 45} 70% 50%)`}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
