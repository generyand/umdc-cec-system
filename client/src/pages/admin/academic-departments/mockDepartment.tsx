import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  UsersIcon,
  ArchiveIcon,
  FlagIcon,
  ClipboardListIcon,
  ArrowUpRight,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// Mock data
const departmentData = {
  name: "College of Computer Studies",
  description:
    "The College of Computer Studies is dedicated to providing quality education in the field of computing and information technology.",
  academicPrograms: {
    active: [
      { code: "BSCS", name: "Bachelor of Science in Computer Science" },
      { code: "BSIT", name: "Bachelor of Science in Information Technology" },
    ],
    inactive: [
      { code: "BSIS", name: "Bachelor of Science in Information Systems" },
    ],
  },
  bannerPrograms: [
    {
      title: "Digital Literacy Program",
      description:
        "A community-based program aimed at improving digital literacy among underserved communities.",
      yearStarted: 2023,
      stats: {
        target: 10,
        completed: 6,
      },
    },
    {
      title: "Tech for Communities",
      description:
        "Empowering local communities through technology education and resources.",
      yearStarted: 2023,
      stats: {
        target: 8,
        completed: 3,
      },
    },
    {
      title: "Youth Innovation Hub",
      description:
        "Fostering innovation and entrepreneurship among young tech enthusiasts.",
      yearStarted: 2023,
      stats: {
        target: 5,
        completed: 2,
      },
    },
  ],
  stats: {
    implementedProjects: {
      target: 10,
      completed: 6,
      totalBeneficiaries: {
        target: 1000,
        actual: 650,
      },
    },
  },
  activities: {
    ongoing: [
      {
        title: "Research Mentorship Program",
        startDate: "2024-01-15",
        endDate: "2024-06-30",
        type: "Research",
        status: "ongoing",
        location: "Research Labs",
        participants: 45,
        progress: 65, // percentage
        milestones: [
          { name: "Initial Research", completed: true },
          { name: "Data Collection", completed: true },
          { name: "Analysis", completed: false },
          { name: "Final Paper", completed: false },
        ],
      },
      {
        title: "Industry Internship Program",
        startDate: "2024-02-01",
        endDate: "2024-07-31",
        type: "Internship",
        status: "ongoing",
        location: "Various Partner Companies",
        participants: 120,
        progress: 40,
        milestones: [
          { name: "Placement", completed: true },
          { name: "Mid-term Evaluation", completed: false },
          { name: "Final Presentation", completed: false },
        ],
      },
    ],
    completed: [
      {
        title: "Web Development Bootcamp",
        startDate: "2024-01-10",
        endDate: "2024-03-10",
        type: "Training",
        status: "completed",
        location: "Computer Labs",
        participants: 75,
        outcome: "52 certified graduates",
        impact: "8 students hired by partner companies",
        keyMetrics: {
          satisfactionRate: 92,
          completionRate: 85,
          employmentRate: 65,
        },
      },
      {
        title: "Community Tech Literacy Drive",
        startDate: "2024-02-15",
        endDate: "2024-03-15",
        type: "Community Service",
        status: "completed",
        location: "Various Community Centers",
        participants: 200,
        outcome: "Basic digital literacy training completed",
        impact: "Reached 5 local communities",
        keyMetrics: {
          beneficiaries: 500,
          volunteerHours: 1200,
          satisfactionRate: 95,
        },
      },
    ],
    upcoming: [
      {
        title: "Annual Tech Summit 2024",
        date: "2024-06-15",
        type: "Conference",
        status: "upcoming",
        location: "Main Auditorium",
        participants: 200,
      },
      {
        title: "Industry Partners Meeting",
        date: "2024-05-20",
        type: "Meeting",
        status: "upcoming",
        location: "Conference Room A",
        participants: 30,
      },
    ],
    recent: [
      {
        title: "Student Hackathon",
        date: "2024-03-10",
        type: "Competition",
        status: "completed",
        location: "Computer Labs",
        participants: 150,
        outcome: "15 projects submitted",
      },
      {
        title: "Faculty Development Workshop",
        date: "2024-03-01",
        type: "Workshop",
        status: "completed",
        location: "Training Room",
        participants: 25,
        outcome: "New curriculum developments",
      },
    ],
  },
};

export default function MockDepartmentPage() {
  const navigate = useNavigate();

  const stats = [
    {
      icon: UsersIcon,
      iconColor: "text-primary",
      iconBgColor: "bg-primary/10",
      title: "Active Programs",
      value: departmentData.academicPrograms.active.length,
      unit: "programs",
      change: 15, // percentage change from previous month
    },
    {
      icon: ArchiveIcon,
      iconColor: "text-orange-500",
      iconBgColor: "bg-orange-100",
      title: "Inactive Programs",
      value: departmentData.academicPrograms.inactive.length,
      unit: "programs",
    },
    {
      icon: FlagIcon,
      iconColor: "text-blue-500",
      iconBgColor: "bg-blue-100",
      title: "Banner Programs",
      value: departmentData.bannerPrograms.length,
      unit: "programs",
    },
    {
      icon: ClipboardListIcon,
      iconColor: "text-green-500",
      iconBgColor: "bg-green-100",
      title: "Projects Completed",
      value: departmentData.stats.implementedProjects.completed,
      unit: "projects",
    },
  ];

  return (
    <div className="mx-auto space-y-8 w-full">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="flex gap-2 items-center hover:bg-accent/50"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Departments</span>
      </Button>

      {/* Header Section */}
      <div className="flex flex-col gap-6 p-6 rounded-lg border md:flex-row md:items-center md:justify-between bg-card">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {departmentData.name}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {departmentData.description}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Download Report</Button>
          <Button className="flex gap-2 items-center">
            Create New Program <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="p-6 transition-all duration-200 hover:shadow-md hover:border-primary/20"
          >
            <div className="flex gap-4 items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-lg shrink-0",
                  stat.iconBgColor,
                  "transition-colors duration-200 group-hover:bg-primary/20"
                )}
              >
                <stat.icon
                  className={cn(
                    "w-6 h-6",
                    stat.iconColor,
                    "transition-colors duration-200"
                  )}
                />
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <div className="flex gap-2 items-baseline">
                  <p className="text-2xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                  <span className="text-sm text-muted-foreground">
                    {stat.unit}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Programs Section - Restructured */}
      <div className="grid gap-8">
        {/* Top Row: Academic Programs and Active Banner Program */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Academic Programs */}
          <Card className="col-span-1 h-fit">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Academic Programs</h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {/* Show only first 3 programs with a "Show More" button if there are more */}
                {departmentData.academicPrograms.active
                  .slice(0, 3)
                  .map((program, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{program.code}</p>
                        <p className="text-sm text-muted-foreground">
                          {program.name}
                        </p>
                      </div>
                      <Badge className="text-green-800 bg-green-100">
                        Active
                      </Badge>
                    </div>
                  ))}
                {departmentData.academicPrograms.active.length > 3 && (
                  <Button variant="ghost" className="mt-4 w-full">
                    Show {departmentData.academicPrograms.active.length - 3}{" "}
                    more programs
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Featured Banner Program */}
          {departmentData.bannerPrograms.length > 0 && (
            <Card className="col-span-2 text-white bg-gradient-to-br from-blue-600 to-indigo-700">
              <div className="p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge
                      variant="secondary"
                      className="text-white bg-white/10"
                    >
                      Featured Banner Program
                    </Badge>
                    <div className="mt-4">
                      <h3 className="text-2xl font-bold">
                        {departmentData.bannerPrograms[0].title}
                      </h3>
                      <p className="mt-2 text-white/80">
                        {departmentData.bannerPrograms[0].description}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-white bg-white/10">
                    Started {departmentData.bannerPrograms[0].yearStarted}
                  </Badge>
                </div>
                {/* Progress stats remain the same */}
              </div>
            </Card>
          )}
        </div>

        {/* Other Banner Programs Grid */}
        {departmentData.bannerPrograms.length > 1 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Other Banner Programs</h2>
              <Button variant="outline" size="sm">
                View All Programs
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {departmentData.bannerPrograms.slice(1).map((program, index) => (
                <Card
                  key={index}
                  className="text-white bg-gradient-to-br from-blue-500 to-indigo-600"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold">{program.title}</h3>
                      <Badge
                        variant="secondary"
                        className="text-white bg-white/10"
                      >
                        {program.yearStarted}
                      </Badge>
                    </div>
                    <p className="mb-4 text-sm text-white/80">
                      {program.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm text-white/60">Progress</p>
                        <p className="text-lg font-bold">
                          {Math.round(
                            (program.stats.completed / program.stats.target) *
                              100
                          )}
                          %
                        </p>
                      </div>
                      <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-white/90"
                          style={{
                            width: `${
                              (program.stats.completed / program.stats.target) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Activities Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Department Activities</h2>
          <Button variant="outline" size="sm">
            View All Activities
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Ongoing Activities */}
          <Card>
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Ongoing Activities</h3>
              <div className="space-y-6">
                {departmentData.activities.ongoing.map((activity, index) => (
                  <div
                    key={index}
                    className="p-4 space-y-3 rounded-lg hover:bg-accent/50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{activity.title}</h4>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{activity.type}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {activity.participants} participants
                          </span>
                        </div>
                      </div>
                      <Badge className="text-blue-800 bg-blue-100">
                        In Progress
                      </Badge>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {activity.progress}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-accent">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${activity.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Milestones */}
                    <div className="grid grid-cols-2 gap-2">
                      {activity.milestones.map((milestone, idx) => (
                        <div
                          key={idx}
                          className="flex gap-2 items-center text-sm"
                        >
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full",
                              milestone.completed
                                ? "bg-green-500"
                                : "bg-gray-300"
                            )}
                          />
                          <span
                            className={cn(
                              milestone.completed
                                ? "text-green-700"
                                : "text-muted-foreground"
                            )}
                          >
                            {milestone.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Completed Activities */}
          <Card>
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold">
                Completed Activities
              </h3>
              <div className="space-y-6">
                {departmentData.activities.completed.map((activity, index) => (
                  <div
                    key={index}
                    className="p-4 space-y-3 rounded-lg hover:bg-accent/50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{activity.title}</h4>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{activity.type}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {activity.participants} participants
                          </span>
                        </div>
                      </div>
                      <Badge className="text-green-800 bg-green-100">
                        Completed
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Outcome:</span>{" "}
                        {activity.outcome}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Impact:</span>{" "}
                        {activity.impact}
                      </p>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-3 gap-4 pt-2">
                      {Object.entries(activity.keyMetrics).map(
                        ([key, value], idx) => (
                          <div key={idx} className="text-center">
                            <div className="text-lg font-bold">
                              {value}
                              {key.includes("Rate") ? "%" : ""}
                            </div>
                            <div className="text-xs capitalize text-muted-foreground">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
