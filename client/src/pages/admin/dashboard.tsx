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
import { Award, HandHeart, Target, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import AdminLayout from "@/components/layouts/admin-layout";

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

export default function DashboardPage() {
  return (
    <AdminLayout>
      <div className="p-8 h-full">
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
                <CardDescription>
                  Weekly participation breakdown
                </CardDescription>
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

          {/* Add content for other tabs */}
        </Tabs>
      </div>
    </AdminLayout>
  );
}
