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
import { CalendarIcon, MapPinIcon, UsersIcon, ArrowUpRight } from "lucide-react";

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
  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Department of Accounting Education
          </h1>
          <p className="mt-2 text-muted-foreground">
            Empowering communities through financial education and literacy programs
          </p>
        </div>
        <Button className="flex items-center gap-2">
          Create New Program <ArrowUpRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border bg-card hover:bg-accent/10 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <UsersIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Academic Programs</p>
              <p className="text-2xl font-bold text-foreground">{academicPrograms.active.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 border bg-card hover:bg-accent/10 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Banner Programs</p>
              <p className="text-2xl font-bold text-foreground">{bannerPrograms.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 border bg-card hover:bg-accent/10 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <MapPinIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Projects Implemented</p>
              <p className="text-2xl font-bold text-foreground">{implementedProjects.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Academic Programs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border bg-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">Active Academic Programs</h2>
            <Button variant="outline" size="sm">View Details</Button>
          </div>
          <div className="space-y-4">
            {academicPrograms.active.map((program, index) => (
              <div key={index} className="p-4 rounded-lg hover:bg-accent/10 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-foreground">{program.code}</h3>
                    <p className="text-sm text-muted-foreground">{program.name}</p>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                    Active
                  </Badge>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <UsersIcon className="h-4 w-4 mr-2" />
                    {program.students} enrolled students
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Since {program.yearStarted}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border bg-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">Inactive Programs</h2>
            <Button variant="outline" size="sm">View History</Button>
          </div>
          <div className="space-y-4">
            {academicPrograms.inactive.map((program, index) => (
              <div key={index} className="p-4 rounded-lg hover:bg-accent/10 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-foreground">{program.code}</h3>
                    <p className="text-sm text-muted-foreground">{program.name}</p>
                  </div>
                  <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400">
                    Inactive
                  </Badge>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Ended {program.yearEnded}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <UsersIcon className="h-4 w-4 mr-2" />
                    Last batch: {program.lastGraduates} graduates
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Add this section after the Academic Programs section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border bg-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">Banner Programs Overview</h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-primary/5">
                <p className="text-sm text-muted-foreground">Total Programs</p>
                <p className="text-2xl font-bold text-foreground">{bannerProgramStats.totalPrograms}</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5">
                <p className="text-sm text-muted-foreground">Implementation Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round((bannerProgramStats.implementedProjects.completed / bannerProgramStats.implementedProjects.target) * 100)}%
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Projects Target</span>
                <span className="font-medium text-foreground">{bannerProgramStats.implementedProjects.target}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-medium text-foreground">{bannerProgramStats.implementedProjects.completed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ongoing</span>
                <span className="font-medium text-foreground">{bannerProgramStats.implementedProjects.ongoing}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border bg-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">Beneficiaries Progress</h2>
            <Button variant="outline" size="sm">Details</Button>
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Target Beneficiaries</span>
                  <span className="font-medium text-foreground">{bannerProgramStats.implementedProjects.totalBeneficiaries.target}</span>
                </div>
                <div className="h-2 bg-primary/10 rounded-full">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ 
                      width: `${(bannerProgramStats.implementedProjects.totalBeneficiaries.actual / bannerProgramStats.implementedProjects.totalBeneficiaries.target) * 100}%` 
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Reach</span>
                <span className="font-medium text-foreground">{bannerProgramStats.implementedProjects.totalBeneficiaries.actual}</span>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="text-sm text-muted-foreground mb-2">Progress</div>
              <p className="text-2xl font-bold text-foreground">
                {Math.round((bannerProgramStats.implementedProjects.totalBeneficiaries.actual / bannerProgramStats.implementedProjects.totalBeneficiaries.target) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">
                of target beneficiaries reached
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Banner Program - remains mostly the same but with updated data */}
      {bannerPrograms.map((program, index) => (
        <Card key={index} className="relative overflow-hidden border-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50" />
          <div className="relative p-8 text-primary-foreground space-y-4">
            <Badge variant="secondary" className="bg-white/20 hover:bg-white/30">
              Banner Program
            </Badge>
            <h2 className="text-2xl font-bold">{program.title}</h2>
            <p className="text-primary-foreground/80 max-w-2xl">
              {program.description}
            </p>
            <div className="flex gap-4">
              <div>
                <p className="text-sm text-primary-foreground/80">Target Beneficiaries</p>
                <p className="text-xl font-bold">{program.targetBeneficiaries}</p>
              </div>
              <div>
                <p className="text-sm text-primary-foreground/80">Actual Beneficiaries</p>
                <p className="text-xl font-bold">{program.actualBeneficiaries}</p>
              </div>
            </div>
            <Button variant="secondary" className="mt-4">
              View Details
            </Button>
          </div>
        </Card>
      ))}

      {/* Analytics */}
      <Card className="p-6 border bg-card">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Program Analytics</h2>
            <p className="text-sm text-muted-foreground">Monthly beneficiaries reached</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">This Year</Button>
            <Button variant="outline" size="sm">Export</Button>
          </div>
        </div>
        <div className="h-[400px]">
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
  );
}
