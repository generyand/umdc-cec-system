import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  BookOpen,
  Target,
  FileText,
  School,
  UserCog,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

const programStats = {
  cwts: {
    enrolled: 185,
    sections: 6,
    instructors: 4,
    projects: 8,
  },
  lts: {
    enrolled: 120,
    sections: 4,
    instructors: 3,
    projects: 6,
  },
};

const coordinators = [
  {
    name: "Dr. Maria Santos",
    role: "NSTP Director",
    program: "Overall",
    contact: "maria.santos@umdc.edu.ph",
  },
  {
    name: "Prof. Juan Dela Cruz",
    role: "CWTS Coordinator",
    program: "CWTS",
    contact: "juan.delacruz@umdc.edu.ph",
  },
  {
    name: "Prof. Ana Reyes",
    role: "LTS Coordinator",
    program: "LTS",
    contact: "ana.reyes@umdc.edu.ph",
  },
];

const classSections = [
  {
    code: "CWTS-1A",
    program: "CWTS",
    schedule: "Monday, 8:00 AM - 11:00 AM",
    venue: "Room 301",
    instructor: "Prof. Garcia",
    enrolled: 32,
  },
  {
    code: "LTS-1A",
    program: "LTS",
    schedule: "Tuesday, 1:00 PM - 4:00 PM",
    venue: "Room 302",
    instructor: "Prof. Lim",
    enrolled: 28,
  },
  // Add more sections...
];

const activeProjects = [
  {
    title: "Community Health Education",
    type: "CWTS",
    status: "ongoing",
    participants: 45,
    hours: 24,
    completion: 65,
    coordinator: "Prof. Garcia",
    location: "Brgy. San Jose",
  },
  {
    title: "Adult Literacy Program",
    type: "LTS",
    status: "ongoing",
    participants: 35,
    hours: 18,
    completion: 50,
    coordinator: "Prof. Lim",
    location: "Brgy. Santa Rosa",
  },
  // Add more projects...
];

export default function NSTPPage() {
  return (
    <div className="p-6 space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">NSTP Program</h1>
          <p className="mt-2 text-muted-foreground">
            National Service Training Program Management
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Download Reports</Button>
          <Button>Add New Project</Button>
        </div>
      </div>

      {/* Program Components Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* CWTS Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Users className="w-5 h-5 text-primary" />
              CWTS Program
            </CardTitle>
            <CardDescription>Civic Welfare Training Service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Enrolled Students
                </p>
                <p className="text-2xl font-bold">
                  {programStats.cwts.enrolled}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">
                  {programStats.cwts.projects}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Program Completion</span>
                <span className="font-medium">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* LTS Card - Similar structure to CWTS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <BookOpen className="w-5 h-5 text-primary" />
              LTS Program
            </CardTitle>
            <CardDescription>Literacy Training Service</CardDescription>
          </CardHeader>
          {/* Similar content structure */}
        </Card>
      </div>

      {/* Program Coordinators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <UserCog className="w-5 h-5 text-primary" />
            Program Coordinators
          </CardTitle>
          <CardDescription>
            NSTP program leadership and coordination team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {coordinators.map((coordinator, index) => (
              <div
                key={index}
                className="p-4 space-y-3 rounded-lg border transition-colors hover:border-primary/50"
              >
                <div className="space-y-1.5">
                  <h4 className="font-semibold">{coordinator.name}</h4>
                  <Badge variant="outline">{coordinator.program}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {coordinator.role}
                  </p>
                  <p className="text-sm font-medium">{coordinator.contact}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Program Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <School className="w-5 h-5" />
            Class Sections
          </CardTitle>
          <CardDescription>
            Active class sections and assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Section</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Enrolled</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classSections.map((section) => (
                <TableRow key={section.code}>
                  <TableCell className="font-medium">{section.code}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{section.program}</Badge>
                  </TableCell>
                  <TableCell>{section.schedule}</TableCell>
                  <TableCell>{section.venue}</TableCell>
                  <TableCell>{section.instructor}</TableCell>
                  <TableCell>{section.enrolled}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Activity Tracking */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex gap-2 items-center">
                <Target className="w-5 h-5" />
                Active Projects
              </CardTitle>
              <CardDescription>
                Ongoing community service projects
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All Projects
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {activeProjects.map((project, index) => (
                <div key={index} className="p-4 space-y-4 rounded-lg border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{project.title}</h4>
                      <div className="flex gap-2 items-center mt-1">
                        <Badge variant="outline">{project.type}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {project.location}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        project.status === "ongoing" ? "default" : "secondary"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Participants</p>
                      <p className="font-medium">{project.participants}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Service Hours</p>
                      <p className="font-medium">{project.hours} hrs</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Completion</p>
                      <p className="font-medium">{project.completion}%</p>
                    </div>
                  </div>
                  <Progress value={project.completion} className="h-2" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Reports Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <FileText className="w-5 h-5" />
            Program Reports
          </CardTitle>
          <CardDescription>
            Performance metrics and documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Completion Rates</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>CWTS</span>
                  <span className="font-medium">88%</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>LTS</span>
                  <span className="font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Required Documentation</h4>
              <div className="space-y-2">{/* Add documentation list */}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
