import { useParams, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Building2,
  GraduationCap,
  Flag,
  HandCoins,
  FileText,
  Paperclip,
  Building,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";
import { projectProposalsService } from "@/services/api/project-proposals.service";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface Proposal {
  id: number;
  title: string;
  description: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  targetDate: string;
  budget: number;
  targetBeneficiaries: string;
  targetArea: string;
  venue: string;
  bannerProgram: {
    name: string;
    description: string;
  } | null;
  department: {
    name: string;
  };
  program: {
    name: string;
  } | null;
  user: {
    firstName: string;
    lastName: string;
  };
  community: {
    name: string;
    communityType: string;
    address: string;
    contactPerson: string;
    contactNumber: string;
  } | null;
  attachments: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    uploadedAt: string;
  }[];
  createdAt: string;
}

export default function ProposalDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: proposal,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["proposal", id],
    queryFn: async () => {
      const response = await projectProposalsService.getProposalById(
        id as string,
        useAuth.getState().token as string
      );

      if (!response.data.success) {
        throw new Error("Failed to fetch proposal details");
      }

      return response.data.data;
    },
    enabled: !!id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: "APPROVED" | "RETURNED") =>
      projectProposalsService.updateProposalStatus(
        id as string,
        newStatus,
        useAuth.getState().token as string
      ),
    onSuccess: () => {
      refetch();
      toast.success("Proposal status updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update proposal status. Please try again.");
      console.error("Error updating proposal status:", error);
    },
  });

  const handleStatusUpdate = (newStatus: "APPROVED" | "RETURNED") => {
    updateStatusMutation.mutate(newStatus);
  };

  const getStatusBadgeVariant = (status: Proposal["status"]) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const formatStatus = (status: string | undefined) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8 mx-auto max-w-4xl">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="w-32 h-10" /> {/* Back button */}
              <Skeleton className="w-24 h-8 rounded-full" />{" "}
              {/* Status badge */}
            </div>
          </div>

          {/* Main Content Skeleton */}
          <Card className="shadow-sm">
            <CardContent className="p-8 space-y-8">
              {/* Title Section */}
              <div className="pb-6 border-b">
                <Skeleton className="mb-2 w-2/3 h-8" /> {/* Title */}
                <div className="flex gap-2 items-center">
                  <Skeleton className="w-40 h-5" /> {/* Author */}
                  <Skeleton className="w-24 h-5" /> {/* Date */}
                </div>
              </div>

              {/* Key Details Section */}
              <div className="grid grid-cols-2 gap-6 py-6 border-b">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <Skeleton className="w-5 h-5" /> {/* Icon */}
                    <div className="flex-1">
                      <Skeleton className="mb-2 w-24 h-4" /> {/* Label */}
                      <Skeleton className="w-full h-6" /> {/* Value */}
                    </div>
                  </div>
                ))}
              </div>

              {/* Description Section */}
              <div className="py-6 border-b">
                <div className="flex gap-2 items-center mb-4">
                  <Skeleton className="w-5 h-5" /> {/* Icon */}
                  <Skeleton className="w-32 h-6" /> {/* Section title */}
                </div>
                <div className="space-y-2">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-3/4 h-4" />
                </div>
              </div>

              {/* Implementation Details */}
              <div className="py-6 border-b">
                <Skeleton className="mb-4 w-48 h-6" /> {/* Section title */}
                <div className="grid gap-6 sm:grid-cols-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <Skeleton className="w-5 h-5" /> {/* Icon */}
                      <div className="flex-1">
                        <Skeleton className="mb-2 w-24 h-4" /> {/* Label */}
                        <Skeleton className="w-full h-6" /> {/* Value */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Partner Section */}
              <div className="py-6 border-b">
                <div className="flex gap-2 items-center mb-4">
                  <Skeleton className="w-5 h-5" /> {/* Icon */}
                  <Skeleton className="w-40 h-6" /> {/* Section title */}
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i}>
                      <Skeleton className="mb-2 w-24 h-4" /> {/* Label */}
                      <Skeleton className="w-full h-6" /> {/* Value */}
                    </div>
                  ))}
                </div>
              </div>

              {/* Attachments Section */}
              <div className="py-6 border-b">
                <div className="flex gap-2 items-center mb-4">
                  <Skeleton className="w-5 h-5" /> {/* Icon */}
                  <Skeleton className="w-32 h-6" /> {/* Section title */}
                </div>
                <div className="space-y-2">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-3/4 h-4" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Skeleton className="w-32 h-10" /> {/* Approve button */}
                <Skeleton className="w-32 h-10" /> {/* Reject button */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8 mx-auto max-w-4xl">
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load proposal details"}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8 mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              onClick={() =>
                navigate("/admin/community-engagement/projects-proposals")
              }
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Proposals
            </Button>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm
              ${getStatusBadgeVariant(proposal?.status as Proposal["status"])}`}
            >
              {formatStatus(proposal?.status)}
            </span>
          </div>
        </div>

        {/* Main Content */}
        {proposal && (
          <Card className="shadow-sm">
            <CardContent className="p-8 space-y-8">
              {/* Title Section */}
              <div className="pb-6 border-b">
                <h1 className="mb-2 text-2xl font-bold text-gray-900">
                  {proposal.title}
                </h1>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">
                    {proposal.user.firstName} {proposal.user.lastName}
                  </span>
                  <span className="mx-2">•</span>
                  <span>
                    {new Date(proposal.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Key Details Section */}
              <div className="grid grid-cols-2 gap-6 py-6 border-b">
                <div className="flex gap-2 items-start">
                  <Building2 className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Department
                    </h4>
                    <p className="mt-1">{proposal.department.name}</p>
                  </div>
                </div>

                {proposal.program && (
                  <div className="flex gap-2 items-start">
                    <GraduationCap className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Academic Program
                      </h4>
                      <p className="mt-1">{proposal.program.name}</p>
                    </div>
                  </div>
                )}

                {/* Banner Program Section */}
                {proposal.bannerProgram && (
                  <div className="flex col-span-2 gap-2 items-start">
                    <Flag className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Banner Program
                      </h4>
                      <p className="mt-1 font-medium">
                        {proposal.bannerProgram.name}
                      </p>
                      {proposal.bannerProgram.description && (
                        <p className="mt-1 text-sm text-gray-600">
                          {proposal.bannerProgram.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 items-start">
                  <HandCoins className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Budget
                    </h4>
                    <p className="mt-1 font-semibold">
                      {new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      }).format(proposal.budget)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="py-6 border-b">
                <div className="flex gap-2 items-center mb-4">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <h3 className="text-lg font-semibold">Description</h3>
                </div>
                <p className="leading-relaxed text-gray-700 whitespace-pre-wrap">
                  {proposal.description}
                </p>
              </div>

              {/* Implementation Details */}
              <div className="py-6 border-b">
                <h3 className="mb-4 text-lg font-semibold">
                  Implementation Details
                </h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex gap-2 items-start">
                    <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Target Date
                      </h4>
                      <p className="mt-1">
                        {new Date(proposal.targetDate).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Venue
                      </h4>
                      <p className="mt-1">{proposal.venue}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Target Area
                      </h4>
                      <p className="mt-1">{proposal.targetArea}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <Users className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Target Beneficiaries
                      </h4>
                      <p className="mt-1">{proposal.targetBeneficiaries}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Community Partner Section */}
              {proposal.community && (
                <div className="py-6 border-b">
                  <div className="flex gap-2 items-center mb-4">
                    <Building className="w-5 h-5 text-gray-500" />
                    <h3 className="text-lg font-semibold">Community Partner</h3>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Name
                      </h4>
                      <p className="mt-1">{proposal.community.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Type
                      </h4>
                      <p className="mt-1">{proposal.community.communityType}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Address
                      </h4>
                      <p className="mt-1">{proposal.community.address}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Contact Details
                      </h4>
                      <p className="flex gap-2 items-center mt-1">
                        <Mail className="w-4 h-4 text-gray-500" />
                        {proposal.community.contactPerson}
                      </p>
                      <p className="flex gap-2 items-center mt-1">
                        <Phone className="w-4 h-4 text-gray-500" />
                        {proposal.community.contactNumber}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Attachments Section */}
              {proposal.attachments && proposal.attachments.length > 0 && (
                <div className="py-6 border-b">
                  <div className="flex gap-2 items-center mb-4">
                    <Paperclip className="w-5 h-5 text-gray-500" />
                    <h3 className="text-lg font-semibold">Attachments</h3>
                  </div>
                  <div className="space-y-2">
                    {/* TODO: Add a type to the file argument */}
                    {/* @ts-expect-error File has no type */}
                    {proposal.attachments.map((file) => (
                      <a
                        key={file.fileUrl}
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 rounded-lg hover:bg-gray-50"
                      >
                        <span className="flex-1 text-blue-600 hover:underline">
                          {file.fileName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(file.uploadedAt).toLocaleDateString()}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {proposal.status === "PENDING" && (
                <div className="flex gap-4 pt-6">
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleStatusUpdate("APPROVED")}
                  >
                    Approve Proposal
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleStatusUpdate("RETURNED")}
                  >
                    Return Proposal
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
