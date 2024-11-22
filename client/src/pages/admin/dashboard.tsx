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
import {
  Award,
  HandHeart,
  Target,
  Users,
  Wallet,
  Activity,
  Filter,
  Download,
  MoreVertical,
  MapPin,
  User,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// Dummy data for demonstration
const projectStats = [
  { name: "Jan", completed: 12, ongoing: 8, planned: 5 },
  { name: "Feb", completed: 15, ongoing: 10, planned: 7 },
  { name: "Mar", completed: 18, ongoing: 12, planned: 8 },
  { name: "Apr", completed: 14, ongoing: 15, planned: 10 },
  { name: "May", completed: 22, ongoing: 18, planned: 12 },
  { name: "Jun", completed: 25, ongoing: 20, planned: 15 },
];

const participationData = [
  { name: "Week 1", students: 145, faculty: 12, community: 45 },
  { name: "Week 2", students: 168, faculty: 15, community: 55 },
  { name: "Week 3", students: 156, faculty: 14, community: 48 },
  { name: "Week 4", students: 192, faculty: 18, community: 62 },
  { name: "Week 5", students: 205, faculty: 20, community: 70 },
  { name: "Week 6", students: 178, faculty: 16, community: 58 },
];

const programDistribution = [
  { name: "Education", value: 35 },
  { name: "Health", value: 25 },
  { name: "Environment", value: 20 },
  { name: "Social Welfare", value: 20 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Additional dummy data for new tabs
const projectsList = [
  {
    id: 1,
    name: "Community Health Initiative",
    status: "ongoing",
    progress: 75,
    participants: 45,
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    location: "Digos City",
    description:
      "Healthcare education and free medical consultations for underserved communities",
    coordinator: "Dr. Maria Santos",
    budget: "₱150,000",
  },
  {
    id: 2,
    name: "Youth Education Program",
    status: "completed",
    progress: 100,
    participants: 120,
    startDate: "2023-11-01",
    endDate: "2024-02-28",
    location: "Davao del Sur",
    description:
      "After-school tutoring and mentorship program for high school students",
    coordinator: "Prof. Juan Cruz",
    budget: "₱85,000",
  },
  {
    id: 3,
    name: "Environmental Conservation Drive",
    status: "ongoing",
    progress: 60,
    participants: 85,
    startDate: "2024-02-01",
    endDate: "2024-07-31",
    location: "Davao City",
    description: "Coastal cleanup and mangrove planting initiative",
    coordinator: "Engr. Ana Reyes",
    budget: "₱120,000",
  },
  {
    id: 4,
    name: "Digital Literacy Workshop",
    status: "planned",
    progress: 0,
    participants: 30,
    startDate: "2024-04-01",
    endDate: "2024-05-30",
    location: "Digos City",
    description: "Basic computer skills training for senior citizens",
    coordinator: "Mr. James Lee",
    budget: "₱50,000",
  },
  {
    id: 5,
    name: "Agricultural Training Program",
    status: "ongoing",
    progress: 40,
    participants: 65,
    startDate: "2024-01-30",
    endDate: "2024-08-30",
    location: "Davao del Sur",
    description: "Sustainable farming techniques for local farmers",
    coordinator: "Dr. Pedro Reyes",
    budget: "₱200,000",
  },
];

const projectMetrics = {
  totalBudget: "₱605,000",
  activeProjects: 3,
  completedProjects: 1,
  plannedProjects: 1,
  totalParticipants: 345,
  averageProgress: 55,
};

const engagementMetrics = [
  { month: "Jan", students: 250, faculty: 28, partners: 12, hours: 450 },
  { month: "Feb", students: 285, faculty: 32, partners: 15, hours: 520 },
  { month: "Mar", students: 320, faculty: 35, partners: 18, hours: 580 },
  // ... add more months
];

const impactIndicators = [
  {
    category: "Education",
    metrics: [
      { name: "Students Mentored", value: 450, increase: "+15%" },
      { name: "Training Hours", value: 1200, increase: "+8%" },
      { name: "Literacy Rate Improvement", value: "12%", increase: "+2%" },
    ],
  },
  {
    category: "Health",
    metrics: [
      { name: "Health Screenings", value: 850, increase: "+25%" },
      { name: "Wellness Programs", value: 24, increase: "+4" },
      { name: "Community Health Workers Trained", value: 45, increase: "+10" },
    ],
  },
  // ... add more categories
];

export default function DashboardPage() {
  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Community Extension Dashboard
          </h2>
          <p className="text-muted-foreground">
            Monitor and analyze community engagement activities
          </p>
        </div>
        <DatePickerWithRange className="w-[300px]" />
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="justify-start w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Active Projects
                </CardTitle>
                <Target className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">
                  +8 new this month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Total Participants
                </CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,845</div>
                <p className="text-xs text-muted-foreground">
                  +312 this quarter
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Partner Organizations
                </CardTitle>
                <HandHeart className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">
                  +3 new partnerships
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Impact Score
                </CardTitle>
                <Award className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">
                  +5% from last quarter
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Project Statistics</CardTitle>
                <CardDescription>
                  Monthly overview of project status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={projectStats}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                    <YAxis stroke="#888888" fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" stackId="a" fill="#0088FE" />
                    <Bar dataKey="ongoing" stackId="a" fill="#00C49F" />
                    <Bar dataKey="planned" stackId="a" fill="#FFBB28" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Program Distribution</CardTitle>
                <CardDescription>By category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={programDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {programDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Stakeholder Participation Trends</CardTitle>
              <CardDescription>Weekly participation breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={participationData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="students"
                    stroke="#0088FE"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="faculty"
                    stroke="#00C49F"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="community"
                    stroke="#FFBB28"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          {/* Project Metrics Overview */}
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex gap-2 items-center text-sm font-medium">
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  Total Budget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projectMetrics.totalBudget}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Allocated for all projects
                </p>
              </CardContent>
            </Card>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex gap-2 items-center text-sm font-medium">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  Active Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projectMetrics.activeProjects}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Currently running
                </p>
              </CardContent>
            </Card>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex gap-2 items-center text-sm font-medium">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projectMetrics.completedProjects}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Completed projects
                </p>
              </CardContent>
            </Card>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex gap-2 items-center text-sm font-medium">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  Planned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projectMetrics.plannedProjects}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Planned projects
                </p>
              </CardContent>
            </Card>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex gap-2 items-center text-sm font-medium">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  Total Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projectMetrics.totalParticipants}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Total participants
                </p>
              </CardContent>
            </Card>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex gap-2 items-center text-sm font-medium">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  Avg. Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projectMetrics.averageProgress}%
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Average progress
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Project List */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Active Projects Overview</CardTitle>
                  <CardDescription>
                    Current and upcoming community extension projects
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 w-4 h-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 w-4 h-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div>
                {projectsList.map((project, index) => (
                  <div
                    key={project.id}
                    className={cn(
                      "p-4 hover:bg-accent/50 cursor-pointer transition-colors",
                      index !== projectsList.length - 1 && "border-b"
                    )}
                  >
                    {/* Header with Title, Status, and Menu */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex gap-2 items-center">
                            <h4 className="font-medium">{project.name}</h4>
                            <Badge
                              variant="secondary"
                              className={cn("capitalize", {
                                "bg-green-100 text-green-700":
                                  project.status === "completed",
                                "bg-blue-100 text-blue-700":
                                  project.status === "ongoing",
                                "bg-orange-100 text-orange-700":
                                  project.status === "planned",
                              })}
                            >
                              {project.status}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                      {/* Project Details */}
                      <div className="grid grid-cols-2 col-span-1 gap-y-2 gap-x-8 text-sm md:col-span-3">
                        <div className="flex gap-2 items-center">
                          <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="truncate">{project.location}</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <User className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="truncate">
                            {project.coordinator}
                          </span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Wallet className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span>{project.budget}</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span>{project.participants} participants</span>
                        </div>
                      </div>

                      {/* Progress Section */}
                      <div className="flex col-span-1 items-center">
                        <div className="w-full space-y-1.5">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium">
                              {project.progress}%
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Due{" "}
                              {new Date(project.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="overflow-hidden h-2 rounded-full bg-secondary">
                            <div
                              className={cn(
                                "h-full transition-all duration-300",
                                project.status === "completed"
                                  ? "bg-green-500"
                                  : "bg-primary"
                              )}
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {engagementMetrics.slice(-1)[0].students && (
              <Card>
                <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Student Volunteers
                  </CardTitle>
                  <Users className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {engagementMetrics.slice(-1)[0].students}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Active this month
                  </p>
                </CardContent>
              </Card>
            )}
            {/* Similar cards for faculty, partners, and hours */}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Engagement Trends</CardTitle>
              <CardDescription>
                Participation across different stakeholder groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={engagementMetrics}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="students"
                    stroke="#0088FE"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="faculty"
                    stroke="#00C49F"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="partners"
                    stroke="#FFBB28"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Impact Tab */}
        <TabsContent value="impact" className="space-y-6">
          {impactIndicators.map((category) => (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle>{category.category} Impact</CardTitle>
                <CardDescription>
                  Key performance indicators and outcomes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {category.metrics.map((metric) => (
                    <div
                      key={metric.name}
                      className="p-4 space-y-2 rounded-lg border"
                    >
                      <div className="text-sm text-muted-foreground">
                        {metric.name}
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="text-2xl font-bold">{metric.value}</div>
                        <span className="text-sm text-green-600">
                          {metric.increase}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
