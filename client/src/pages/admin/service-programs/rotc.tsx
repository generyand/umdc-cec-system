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
import { Users, Calendar, Shield, Target, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

// Sample data - Replace with actual API data
const programStats = {
  totalEnrollment: 245,
  activeClasses: 8,
  trainingLocations: 3,
  coordinators: 5,
};

const schedules = [
  {
    day: "Monday",
    time: "7:00 AM - 9:00 AM",
    activity: "Physical Training",
    location: "University Grounds",
    instructor: "Lt. Santos",
  },
  {
    day: "Wednesday",
    time: "2:00 PM - 5:00 PM",
    activity: "Military Science",
    location: "Room 301",
    instructor: "Maj. Cruz",
  },
  {
    day: "Saturday",
    time: "6:00 AM - 12:00 PM",
    activity: "Field Training",
    location: "Training Field",
    instructor: "Capt. Reyes",
  },
];

const upcomingEvents = [
  {
    date: "2024-04-15",
    title: "Leadership Development Training",
    type: "Special Event",
    status: "upcoming",
  },
  {
    date: "2024-04-22",
    title: "Community Disaster Preparedness",
    type: "Community Service",
    status: "upcoming",
  },
  {
    date: "2024-05-01",
    title: "Field Training Exercise",
    type: "Training",
    status: "planned",
  },
];

const cadre = [
  {
    name: "Maj. Juan Cruz",
    position: "Program Director",
    specialization: "Military Science",
    contact: "juan.cruz@umdc.edu.ph",
  },
  {
    name: "Capt. Maria Reyes",
    position: "Training Officer",
    specialization: "Physical Training",
    contact: "maria.reyes@umdc.edu.ph",
  },
];

export default function ROTCPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ROTC Program</h1>
          <p className="mt-2 text-muted-foreground">
            Reserve Officers' Training Corps Management System
          </p>
        </div>
        <Button>Generate Report</Button>
      </div>

      {/* Program Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Total Enrollment
            </CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {programStats.totalEnrollment}
            </div>
            <p className="text-xs text-muted-foreground">
              Active cadets for this semester
            </p>
          </CardContent>
        </Card>
        {/* Add similar cards for other stats */}
      </div>

      {/* Schedule and Activities */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Calendar className="w-5 h-5" />
              Weekly Schedule
            </CardTitle>
            <CardDescription>Regular training schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((schedule) => (
                  <TableRow key={schedule.day}>
                    <TableCell className="font-medium">
                      {schedule.day}
                    </TableCell>
                    <TableCell>{schedule.time}</TableCell>
                    <TableCell>{schedule.activity}</TableCell>
                    <TableCell>{schedule.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Target className="w-5 h-5" />
              Upcoming Events
            </CardTitle>
            <CardDescription>Special activities and events</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 rounded-lg border"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{event.title}</p>
                      <div className="flex gap-2 items-center text-sm">
                        <Badge variant="outline">{event.type}</Badge>
                        <span className="text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        event.status === "upcoming" ? "default" : "secondary"
                      }
                    >
                      {event.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Management Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Shield className="w-5 h-5" />
              Cadre & Instructors
            </CardTitle>
            <CardDescription>
              Program leadership and instruction team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cadre.map((member, index) => (
                <div key={index} className="p-4 space-y-2 rounded-lg border">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.position}
                      </p>
                    </div>
                    <Badge variant="outline">{member.specialization}</Badge>
                  </div>
                  <p className="text-sm">{member.contact}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Award className="w-5 h-5" />
              Performance Overview
            </CardTitle>
            <CardDescription>Training and assessment metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Physical Training</span>
                  <span className="font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Academic Performance</span>
                  <span className="font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Leadership Assessment</span>
                  <span className="font-medium">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
