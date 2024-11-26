import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  UsersIcon,
  ArchiveIcon,
  FlagIcon,
  ClipboardListIcon,
  ArrowUpRight
} from "lucide-react";
import { StatCard } from "@/components/admin/academic-departments/stat-card";

// Mock data
const academicPrograms = {
  active: [
    {
      code: "BSA",
      name: "Bachelor of Science in Accountancy",
      students: 450,
      yearStarted: 1995,
    },
    {
      code: "BSMA",
      name: "Bachelor of Science in Management Accounting",
      students: 320,
      yearStarted: 2005,
    }
  ],
  inactive: [
    {
      code: "BSBAMajAcc",
      name: "BSBA Major in Accounting",
      yearEnded: 2010,
      lastGraduates: 89,
    }
  ]
};

const bannerPrograms = [
  {
    title: "Financial Literacy Movement",
    description: "A comprehensive initiative aimed at improving financial literacy among local communities through workshops, seminars, and one-on-one consultations.",
    status: "Active",
    yearStarted: 2023,
    targetBeneficiaries: 5000,
    actualBeneficiaries: 2450,
  }
];

const implementedProjects = [
  {
    title: "Financial Literacy for Small Businesses",
    date: "March 15, 2024",
    targetBeneficiaries: 200,
    actualBeneficiaries: 150,
    location: "Barangay San Jose",
    status: "Completed",
  },
  {
    title: "Basic Bookkeeping Workshop",
    date: "February 1, 2024",
    targetBeneficiaries: 100,
    actualBeneficiaries: 75,
    location: "Barangay Santa Rosa",
    status: "Completed",
  },
];

const analyticsData = [
  { month: "Jan", beneficiaries: 65 },
  { month: "Feb", beneficiaries: 75 },
  { month: "Mar", beneficiaries: 150 },
  // ... more monthly data ...
];

// Update/Add this mock data
const bannerProgramStats = {
  totalPrograms: 3,
  implementedProjects: {
    total: 12,
    target: 15,
    completed: 8,
    ongoing: 4,
    totalBeneficiaries: {
      target: 5000,
      actual: 3240
    }
  }
};

export default function DAEPage() {
  const stats = [
    {
      icon: UsersIcon,
      iconColor: "text-primary",
      iconBgColor: "bg-primary/10",
      title: "Active Academic Programs",
      subtitle: "Currently running",
      value: academicPrograms.active.length,
      unit: academicPrograms.active.length === 1 ? "program" : "programs"
    },
    {
      icon: ArchiveIcon,
      iconColor: "text-orange-500",
      iconBgColor: "bg-orange-100 dark:bg-orange-500/10",
      title: "Inactive Programs",
      subtitle: "Historical records",
      value: academicPrograms.inactive.length,
      unit: academicPrograms.inactive.length === 1 ? "program" : "programs"
    },
    {
      icon: FlagIcon,
      iconColor: "text-blue-500",
      iconBgColor: "bg-blue-100 dark:bg-blue-500/10",
      title: "Banner Programs",
      subtitle: "Featured initiatives",
      value: bannerPrograms.length,
      unit: bannerPrograms.length === 1 ? "program" : "programs"
    },
    {
      icon: ClipboardListIcon,
      iconColor: "text-green-500",
      iconBgColor: "bg-green-100 dark:bg-green-500/10",
      title: "Total Projects",
      subtitle: "Implemented activities",
      value: implementedProjects.length,
      unit: implementedProjects.length === 1 ? "project" : "projects"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header Section - Enhanced */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between bg-card p-6 rounded-lg border">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Department of Accounting Education
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Empowering communities through financial education and literacy programs
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Download Report</Button>
          <Button className="flex items-center gap-2">
            Create New Program <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Stats - Reorganized */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            {...stat}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Programs Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border bg-card">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-foreground">Academic Programs</h2>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Active Academic Programs</h3>
                <div className="space-y-3">
                  {academicPrograms.active.map((program, index) => (
                    <div key={index} className="flex justify-between items-start p-3 rounded-lg hover:bg-accent/10 transition-colors">
                      <div>
                        <h4 className="font-medium text-foreground">{program.code}</h4>
                        <p className="text-sm text-muted-foreground">{program.name}</p>
                      </div>
                      <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                        Active
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Inactive Programs</h3>
                <div className="space-y-3">
                  {academicPrograms.inactive.map((program, index) => (
                    <div key={index} className="flex justify-between items-start p-3 rounded-lg hover:bg-accent/10 transition-colors">
                      <div>
                        <h4 className="font-medium text-foreground">{program.code}</h4>
                        <p className="text-sm text-muted-foreground">{program.name}</p>
                      </div>
                      <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400">
                        Inactive
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Banner Programs and Analytics Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Banner Program Card */}
          <Card className="relative overflow-hidden border-0">
            {/* Gradient background with subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700" />
            <div className="absolute inset-0 bg-black/5" /> {/* Subtle overlay */}

            <div className="relative p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <Badge
                    variant="secondary"
                    className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm"
                  >
                    Banner Program
                  </Badge>
                  <p className="text-white/60 text-sm">Active since {bannerPrograms[0].yearStarted}</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm"
                >
                  View Details
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    {bannerPrograms[0].title}
                  </h2>
                  <p className="text-white/80 leading-relaxed max-w-3xl">
                    {bannerPrograms[0].description}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-white/60 text-sm mb-1">Target Projects</p>
                    <p className="text-2xl font-bold text-white">
                      {bannerProgramStats.implementedProjects.target}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-white/60 text-sm mb-1">Completed</p>
                    <p className="text-2xl font-bold text-white">
                      {bannerProgramStats.implementedProjects.completed}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-white/60 text-sm mb-1">Target Reach</p>
                    <p className="text-2xl font-bold text-white">
                      {bannerProgramStats.implementedProjects.totalBeneficiaries.target.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-white/60 text-sm mb-1">Current Reach</p>
                    <div className="flex items-end gap-2">
                      <p className="text-2xl font-bold text-white">
                        {bannerProgramStats.implementedProjects.totalBeneficiaries.actual.toLocaleString()}
                      </p>
                      <p className="text-white/60 text-sm mb-1">
                        ({Math.round((bannerProgramStats.implementedProjects.totalBeneficiaries.actual / bannerProgramStats.implementedProjects.totalBeneficiaries.target) * 100)}%)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-6 space-y-2">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/90 rounded-full transition-all duration-500"
                      style={{
                        width: `${(bannerProgramStats.implementedProjects.totalBeneficiaries.actual / bannerProgramStats.implementedProjects.totalBeneficiaries.target) * 100}%`
                      }}
                    />
                  </div>
                  <p className="text-sm text-white/60">Overall Progress</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Analytics Chart */}
          <Card className="p-6 border bg-card">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Monthly Analytics</h2>
                <p className="text-sm text-muted-foreground">Beneficiaries reached per month</p>
              </div>
              <Button variant="outline" size="sm">Export</Button>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="month"
                    className="text-muted-foreground"
                  />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border rounded-lg p-2 shadow-lg">
                            <p className="text-sm text-foreground">
                              {`${payload[0].value} beneficiaries`}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="beneficiaries"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
