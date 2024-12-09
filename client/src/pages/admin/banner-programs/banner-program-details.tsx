import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Edit,
  PlusCircle,
  Download,
  ChevronRight,
  Info,
  Building2,
  Calendar,
  FolderOpen,
  MapPin,
  MoreHorizontal,
  Filter,
  Upload,
  CalendarCheck,
  CheckCircle2,
  FileText,
  School,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

const MOCK_PROGRAM = {
  id: 1,
  name: "Community Extension Program",
  abbreviation: "CEP",
  description:
    "A comprehensive program aimed at sustainable community development through various educational and social initiatives.",
  yearStarted: 2020,
  status: "ACTIVE",
  department: {
    id: 1,
    name: "Community Extension Office",
    abbreviation: "CEO",
  },
  academicPrograms: [
    {
      id: 1,
      name: "Bachelor of Science in Community Development",
      abbreviation: "BSCD",
      status: "ACTIVE",
      totalStudents: 150,
    },
    {
      id: 2,
      name: "Bachelor of Science in Social Work",
      abbreviation: "BSSW",
      status: "ACTIVE",
      totalStudents: 120,
    },
  ],
  projectProposals: [
    {
      id: 1,
      title: "Community Literacy Program",
      description: "Literacy program for underserved communities",
      targetBeneficiaries: "Out-of-school youth",
      targetArea: "Barangay 76-A",
      targetDate: "2024-06-15",
      venue: "Community Center",
      budget: 50000,
      status: "ACTIVE",
    },
    {
      id: 2,
      title: "Health and Wellness Campaign",
      description: "Health awareness and free medical consultation",
      targetBeneficiaries: "Senior citizens",
      targetArea: "Barangay Buhangin",
      targetDate: "2024-07-20",
      venue: "Barangay Hall",
      budget: 75000,
      status: "PENDING",
    },
  ],
  activities: [
    {
      id: 1,
      title: "Community Literacy Program",
      description: "Literacy program for underserved communities",
      targetDate: "2024-06-15",
      status: "UPCOMING",
      partnerCommunity: {
        name: "Barangay 76-A",
        communityType: "Barangay",
      },
    },
    {
      id: 2,
      title: "Medical Mission",
      description: "Free medical check-up and consultation",
      targetDate: "2024-07-20",
      status: "COMPLETED",
      partnerCommunity: {
        name: "Barangay Buhangin",
        communityType: "Barangay",
      },
    },
  ],
  documents: [
    {
      id: 1,
      fileName: "CEP_Proposal_2024.pdf",
      fileUrl: "/documents/cep_proposal_2024.pdf",
      fileSize: 1024576, // 1MB
      fileType: "application/pdf",
      category: "PROPOSAL_FILE",
      uploadedAt: "2024-01-15",
    },
    {
      id: 2,
      fileName: "Activity_Report_Q1_2024.pdf",
      fileUrl: "/documents/activity_report_q1_2024.pdf",
      fileSize: 2048576, // 2MB
      fileType: "application/pdf",
      category: "DOCUMENTATION",
      uploadedAt: "2024-03-30",
    },
  ],
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-800";
    case "INACTIVE":
      return "bg-slate-100 text-slate-800";
    case "SUSPENDED":
      return "bg-amber-100 text-amber-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const BannerProgramSkeleton = () => (
  <div className="container py-8 space-y-6">
    <div className="space-y-4">
      <Skeleton className="w-32 h-10" />
      <div className="flex justify-between">
        <div className="space-y-2">
          <Skeleton className="w-64 h-8" />
          <Skeleton className="w-48 h-4" />
        </div>
        <Skeleton className="w-32 h-10" />
      </div>
    </div>
    {/* Add more skeleton UI */}
  </div>
);

export default function BannerProgramDetailsPage() {
  const { id } = useParams();

  const { data: program, isLoading } = useQuery({
    queryKey: ["banner-program", id],
    queryFn: () => Promise.resolve(MOCK_PROGRAM),
  });

  if (isLoading) return <BannerProgramSkeleton />;
  if (!program) return <div>Program not found</div>;

  return (
    <div className="container py-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link to="/admin" className="hover:text-foreground">
            Admin
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/admin/banner-programs" className="hover:text-foreground">
            Banner Programs
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{program.abbreviation}</span>
        </div>

        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {program.name}
            </h1>
            <div className="flex gap-4 items-center">
              <Badge
                className={cn(getStatusColor(program.status), "px-3 py-1")}
              >
                {program.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Started {program.yearStarted}
              </span>
              <span className="text-sm text-muted-foreground">
                {program.department.abbreviation}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 w-4 h-4" />
              Export
            </Button>
            <Button>
              <Edit className="mr-2 w-4 h-4" />
              Edit Program
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* About Section */}
          <Card>
            <CardHeader className="flex flex-row gap-4 items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">About the Program</h2>
                <p className="text-sm text-muted-foreground">
                  Program details and information
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="max-w-none prose">
                <p>{program.description}</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="space-y-2">
                  <h3 className="font-medium">Department</h3>
                  <div className="flex gap-2 items-center">
                    <Building2 className="w-4 h-4 text-violet-500" />
                    <p className="text-muted-foreground">
                      {program.department.name}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Year Started</h3>
                  <div className="flex gap-2 items-center">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <p className="text-muted-foreground">
                      {program.yearStarted}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Total Projects</h3>
                  <div className="flex gap-2 items-center">
                    <FolderOpen className="w-4 h-4 text-amber-500" />
                    <p className="text-muted-foreground">
                      {program.activities.length}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="overflow-hidden relative">
              <CardContent className="p-6">
                <div className="absolute top-4 right-4">
                  <School className="w-8 h-8 text-cyan-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Academic Programs
                  </h3>
                  <p className="text-3xl font-bold">
                    {program.academicPrograms.length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden relative">
              <CardContent className="p-6">
                <div className="absolute top-4 right-4">
                  <CalendarCheck className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Upcoming Projects
                  </h3>
                  <p className="text-3xl font-bold">
                    {
                      program.activities.filter((a) => a.status === "UPCOMING")
                        .length
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden relative">
              <CardContent className="p-6">
                <div className="absolute top-4 right-4">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Completed Projects
                  </h3>
                  <p className="text-3xl font-bold">
                    {
                      program.activities.filter((a) => a.status === "COMPLETED")
                        .length
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden relative">
              <CardContent className="p-6">
                <div className="absolute top-4 right-4">
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Documents
                  </h3>
                  <p className="text-3xl font-bold">
                    {program.documents.length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Insights Section */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Upcoming Projects */}
            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-2">
                <div className="space-y-1">
                  <h3 className="text-base font-medium">Upcoming Projects</h3>
                  <p className="text-sm text-muted-foreground">
                    Projects scheduled in the next 30 days
                  </p>
                </div>
                <Link
                  to="#projects"
                  className="flex items-center text-sm text-primary hover:underline"
                >
                  View all
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {program.activities
                    .filter((a) => a.status === "UPCOMING")
                    .slice(0, 3)
                    .map((activity) => (
                      <div
                        key={activity.id}
                        className="flex justify-between items-start pb-4 border-b last:border-0 last:pb-0"
                      >
                        <div className="space-y-1">
                          <p className="font-medium">{activity.title}</p>
                          <div className="flex gap-2 items-center text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 text-emerald-500" />
                            {formatDate(activity.targetDate)}
                          </div>
                          <div className="flex gap-2 items-center text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 text-rose-500" />
                            {activity.partnerCommunity.name}
                          </div>
                        </div>
                        <Badge className={cn(getStatusColor(activity.status))}>
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Recently Completed */}
            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-2">
                <div className="space-y-1">
                  <h3 className="text-base font-medium">Recently Completed</h3>
                  <p className="text-sm text-muted-foreground">
                    Successfully completed projects
                  </p>
                </div>
                <Link
                  to="#projects"
                  className="flex items-center text-sm text-primary hover:underline"
                >
                  View all
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {program.activities
                    .filter((a) => a.status === "COMPLETED")
                    .slice(0, 3)
                    .map((activity) => (
                      <div
                        key={activity.id}
                        className="flex justify-between items-start pb-4 border-b last:border-0 last:pb-0"
                      >
                        <div className="space-y-1">
                          <p className="font-medium">{activity.title}</p>
                          <div className="flex gap-2 items-center text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 text-emerald-500" />
                            {formatDate(activity.targetDate)}
                          </div>
                          <div className="flex gap-2 items-center text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 text-rose-500" />
                            {activity.partnerCommunity.name}
                          </div>
                        </div>
                        <Badge className={cn(getStatusColor(activity.status))}>
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Projects</h2>
              <p className="text-sm text-muted-foreground">
                View all upcoming and completed projects
              </p>
            </div>
            <Button>
              <PlusCircle className="mr-2 w-4 h-4 text-white" />
              New Project
            </Button>
          </div>

          {/* Status Filter */}
          <div className="flex gap-4">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="UPCOMING">Upcoming</SelectItem>
                <SelectItem value="ONGOING">Ongoing</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[40%]">Project Details</TableHead>
                    <TableHead className="w-[25%]">Partner Community</TableHead>
                    <TableHead className="w-[15%]">Target Date</TableHead>
                    <TableHead className="w-[10%]">Status</TableHead>
                    <TableHead className="w-[10%]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {program.activities.map((activity) => (
                    <TableRow key={activity.id} className="group">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{activity.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {activity.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 items-start">
                          <MapPin className="mt-1 w-4 h-4 text-muted-foreground" />
                          <div>
                            <div>{activity.partnerCommunity.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {activity.partnerCommunity.communityType}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 items-center">
                          <Calendar className="w-4 h-4 text-emerald-500" />
                          {formatDate(activity.targetDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(getStatusColor(activity.status))}>
                          {activity.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="opacity-0 transition-opacity group-hover:opacity-100">
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">Documents</h2>
                <p className="text-sm text-muted-foreground">
                  Manage and view program documents
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="mr-2 w-4 h-4" />
                  Filter
                </Button>
                <Button>
                  <Upload className="mr-2 w-4 h-4" />
                  Upload Document
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {program.documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          <div className="flex gap-2 items-center">
                            <FileText className="w-4 h-4 text-amber-500" />
                            {doc.fileName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{doc.category}</Badge>
                        </TableCell>
                        <TableCell>
                          {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                        </TableCell>
                        <TableCell>{formatDate(doc.uploadedAt)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
