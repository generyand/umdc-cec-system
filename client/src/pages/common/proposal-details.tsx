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
  Clock,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";
import { projectProposalsService } from "@/services/api/project-proposals.service";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { approvalsApi } from "@/services/api/approvals.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import React from "react";

interface Proposal {
  id: number;
  title: string;
  description: string;
  status: "PENDING" | "APPROVED" | "RETURNED";
  targetDate: string;
  budget: string;
  targetBeneficiaries: string;
  targetArea: string;
  venue: string;
  createdAt: string;

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
  bannerProgram: {
    name: string;
    description: string;
  } | null;
  attachments: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    uploadedAt: string;
  }[];
  approvals: {
    approverPosition: string;
    status: string;
    comment: string | null;
    approvedAt: string;
    approver: {
      firstName: string;
      lastName: string;
    };
  }[];
  approvalFlow: {
    role: string;
    status: string;
    comment: string | null;
    approvedAt: string;
    approvedBy: string;
  }[];
}

const APPROVAL_SEQUENCE = [
  "CEC_HEAD",
  "VP_DIRECTOR",
  "CHIEF_OPERATION_OFFICER",
] as const;

type ApprovalRole = (typeof APPROVAL_SEQUENCE)[number];

// Add these variants for animations
// const progressVariants = {
//   pending: { scaleY: 0 },
//   inProgress: { scaleY: 0.5 },
//   complete: { scaleY: 1 },
// };

const circleVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  approved: {
    scale: 1.1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 10,
    },
  },
};

// const contentVariants = {
//   initial: { opacity: 0, y: 20 },
//   animate: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.5,
//     },
//   },
// };

// const checkmarkVariants = {
//   initial: { pathLength: 0 },
//   animate: {
//     pathLength: 1,
//     transition: {
//       duration: 0.5,
//       ease: "easeInOut",
//     },
//   },
// };

export default function ProposalDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

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
    mutationFn: async ({
      status,
      comment,
    }: {
      status: "APPROVED" | "RETURNED";
      comment?: string;
    }) => {
      if (status === "APPROVED") {
        return approvalsApi.approveProposal(Number(id), comment);
      } else {
        // Return requires a comment
        return approvalsApi.returnProposal(
          Number(id),
          comment || "Proposal returned"
        );
      }
    },
    onSuccess: () => {
      refetch();
      toast.success("Proposal status updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update proposal status. Please try again.");
      console.error("Error updating proposal status:", error);
    },
  });

  // Add these new states
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [comment, setComment] = useState("");

  const handleStatusUpdate = (newStatus: "APPROVED" | "RETURNED") => {
    updateStatusMutation.mutate(
      { status: newStatus, comment },
      {
        onSuccess: () => {
          setShowApproveDialog(false);
          setShowReturnDialog(false);
          setComment("");
        },
      }
    );
  };

  const getStatusBadgeVariant = (status: Proposal["status"]) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "RETURNED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const formatStatus = (status: string | undefined) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const getSortedApprovalFlow = (approvalFlow: Proposal["approvalFlow"]) => {
    return [...approvalFlow].sort((a, b) => {
      const aIndex = APPROVAL_SEQUENCE.indexOf(
        a.role as (typeof APPROVAL_SEQUENCE)[number]
      );
      const bIndex = APPROVAL_SEQUENCE.indexOf(
        b.role as (typeof APPROVAL_SEQUENCE)[number]
      );
      return aIndex - bIndex;
    });
  };

  // Helper function to check if user is current approver
  const isCurrentApprover = () => {
    if (!proposal || !user) return false;

    console.log("proposal", proposal);

    // Find the first pending approval step
    const currentStep = proposal.approvalFlow.find(
      (step: { status: string }) => step.status === "PENDING"
    );

    console.log("current step", currentStep);

    // Check if the current user's role matches the required role for this step
    // TODO: change to position
    return currentStep?.role === user.position;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8 mx-auto max-w-7xl">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="w-32 h-10" /> {/* Back button */}
              <Skeleton className="w-24 h-8 rounded-full" />{" "}
              {/* Status badge */}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column - Main Content Skeleton */}
            <div className="lg:col-span-2">
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

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6">
                    <Skeleton className="w-32 h-10" /> {/* Approve button */}
                    <Skeleton className="w-32 h-10" /> {/* Reject button */}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Approval Progress Skeleton */}
            <div className="lg:col-span-1">
              <Card className="overflow-hidden sticky top-8 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex gap-2 items-center mb-4">
                    <Skeleton className="w-5 h-5" /> {/* Icon */}
                    <Skeleton className="w-40 h-6" /> {/* Title */}
                  </div>
                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute h-[calc(100%-32px)] w-0.5 bg-gray-200 left-4 top-8" />

                    {/* Approval Steps Skeleton */}
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="flex gap-4 mb-8 last:mb-0">
                        {/* Circle */}
                        <div className="relative z-10">
                          <Skeleton className="w-8 h-8 rounded-full" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <Skeleton className="mb-2 w-32 h-5" />{" "}
                              {/* Role */}
                              <Skeleton className="w-24 h-4" /> {/* Approver */}
                            </div>
                            <Skeleton className="w-20 h-6 rounded-full" />{" "}
                            {/* Status */}
                          </div>
                          <Skeleton className="mt-2 w-32 h-4" /> {/* Date */}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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
      <div className="container py-8 mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
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
                        {format(new Date(proposal.createdAt), "MMM d, yyyy")}
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
                        <h3 className="text-lg font-semibold">
                          Community Partner
                        </h3>
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
                          <p className="mt-1">
                            {proposal.community.communityType}
                          </p>
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
                  {isCurrentApprover() && (
                    <div className="flex gap-4 pt-6">
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => setShowApproveDialog(true)}
                      >
                        Approve Proposal
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => setShowReturnDialog(true)}
                      >
                        Return Proposal
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Approval Progress */}
            <div className="lg:col-span-1">
              <Card className="overflow-hidden sticky top-8 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex gap-2 items-center mb-6">
                    <Users className="w-5 h-5 text-gray-500" />
                    <h3 className="text-lg font-semibold">Approval Progress</h3>
                  </div>

                  {/* Grid container with 3 rows for the 3 approval steps */}
                  <div className="relative min-h-[250px]">
                    <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-8">
                      {/* Approval Steps */}
                      {getSortedApprovalFlow(proposal.approvalFlow).map(
                        (step, index) => (
                          <React.Fragment key={step.role}>
                            {/* Circle */}
                            <div className="relative">
                              <motion.div
                                variants={circleVariants}
                                animate={
                                  step.status === "APPROVED"
                                    ? "approved"
                                    : "animate"
                                }
                              >
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    step.status === "APPROVED"
                                      ? "bg-green-100 text-green-600 ring-2 ring-green-600"
                                      : step.status === "RETURNED"
                                      ? "bg-red-100 text-red-600 ring-2 ring-red-600"
                                      : "bg-gray-100 text-gray-600 ring-2 ring-gray-300"
                                  }`}
                                >
                                  {index + 1}
                                </div>
                              </motion.div>
                            </div>

                            {/* Content */}
                            <div>
                              <div className="flex flex-wrap gap-2 justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {step.role.split("_").join(" ")}
                                  </h4>
                                  {step.approvedBy && (
                                    <p className="text-sm text-gray-500">
                                      Approved by {step.approvedBy}
                                    </p>
                                  )}
                                  {step.status === "PENDING" &&
                                    !proposal.approvalFlow.some(
                                      (s: { status: string; role: string }) =>
                                        s.status === "PENDING" &&
                                        APPROVAL_SEQUENCE.indexOf(
                                          s.role as ApprovalRole
                                        ) <
                                          APPROVAL_SEQUENCE.indexOf(
                                            step.role as ApprovalRole
                                          )
                                    ) && (
                                      <p className="mt-1 text-xs text-amber-600">
                                        Note: If no action is taken within 3
                                        days, the approver must be notified.
                                      </p>
                                    )}
                                </div>
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1 ${
                                    step.status === "APPROVED"
                                      ? "bg-green-100 text-green-600"
                                      : step.status === "RETURNED"
                                      ? "bg-red-100 text-red-600"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {step.status === "APPROVED" ? (
                                    <Check className="w-3 h-3" />
                                  ) : step.status === "RETURNED" ? (
                                    <X className="w-3 h-3" />
                                  ) : (
                                    <Clock className="w-3 h-3" />
                                  )}
                                  {step.status}
                                </span>
                              </div>
                              {step.approvedAt && (
                                <p className="mt-1 text-sm text-gray-500">
                                  {format(
                                    new Date(step.approvedAt),
                                    "MMM d, yyyy 'at' h:mm a"
                                  )}
                                </p>
                              )}
                              {step.comment && (
                                <p className="p-3 mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg">
                                  "{step.comment}"
                                </p>
                              )}
                            </div>
                          </React.Fragment>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Approve Dialog */}
        <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Proposal</DialogTitle>
              <DialogDescription>
                Are you sure you want to approve this proposal? You can add an
                optional comment below.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Add a comment (optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowApproveDialog(false);
                  setComment("");
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleStatusUpdate("APPROVED")}
                disabled={updateStatusMutation.isPending}
              >
                {updateStatusMutation.isPending ? "Approving..." : "Approve"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Return Dialog */}
        <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Return Proposal</DialogTitle>
              <DialogDescription>
                Please provide a reason for returning this proposal. This will
                be visible to the proposal owner.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Enter reason for returning"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowReturnDialog(false);
                  setComment("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleStatusUpdate("RETURNED")}
                disabled={updateStatusMutation.isPending || !comment.trim()}
              >
                {updateStatusMutation.isPending ? "Returning..." : "Return"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
