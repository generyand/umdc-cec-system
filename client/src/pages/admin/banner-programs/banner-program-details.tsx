import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, PlusCircle } from "lucide-react";
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
import { FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        <Button
          variant="ghost"
          className="w-fit"
          onClick={() => history.back()}
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Programs
        </Button>

        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex gap-3 items-center">
              <h1 className="text-3xl font-bold">{program.abbreviation}</h1>
              <Badge className={cn(getStatusColor(program.status))}>
                {program.status}
              </Badge>
            </div>
            <p className="text-xl text-muted-foreground">{program.name}</p>
          </div>
          <Button>
            <Edit className="mr-2 w-4 h-4" />
            Edit Program
          </Button>
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
          {/* Program Details Card */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">About the Program</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>{program.description}</p>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-medium">Department</h3>
                  <p className="text-muted-foreground">
                    {program.department.name}
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-medium">Year Started</h3>
                  <p className="text-muted-foreground">{program.yearStarted}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Academic Programs
                  </h3>
                  <p className="text-2xl font-bold">
                    {program.academicPrograms.length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Project Proposals
                  </h3>
                  <p className="text-2xl font-bold">
                    {program.projectProposals.length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Activities
                  </h3>
                  <p className="text-2xl font-bold">
                    {program.activities.length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Active Projects
                  </h3>
                  <p className="text-2xl font-bold">
                    {
                      program.projectProposals.filter(
                        (p) => p.status === "ACTIVE"
                      ).length
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Academic Programs Section */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <h2 className="text-xl font-semibold">Academic Programs</h2>
            </CardHeader>
            <CardContent>
              {/* Table or grid of academic programs */}
              {program.academicPrograms.map((ap) => (
                <div
                  key={ap.id}
                  className="flex justify-between items-center py-4 border-b"
                >
                  <div>
                    <h3 className="font-medium">{ap.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {ap.abbreviation}
                    </p>
                  </div>
                  <Badge variant="secondary">{ap.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
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
              <PlusCircle className="mr-2 w-4 h-4" />
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
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Partner Community</TableHead>
                    <TableHead>Target Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {program.activities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p>{activity.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{activity.partnerCommunity.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.partnerCommunity.communityType}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(activity.targetDate)}</TableCell>
                      <TableCell>
                        <Badge className={cn(getStatusColor(activity.status))}>
                          {activity.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Documents</h2>
            <Button>
              <PlusCircle className="mr-2 w-4 h-4" />
              Upload Document
            </Button>
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
                          <FileText className="w-4 h-4 text-muted-foreground" />
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
