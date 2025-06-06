import { Request, Response, RequestHandler } from "express";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/errors.js";
import { Decimal } from "@prisma/client/runtime/library";
import { createClient } from "@supabase/supabase-js";
import { NotificationService } from "@/services/notification.service.js";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase environment variables");
  throw new Error("Missing required environment variables");
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Get all project proposals
export const getAllProposals: RequestHandler = async (req, res) => {
  try {
    console.log("📃 Fetching all proposals...");
    const proposals = await prisma.projectProposal.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        bannerProgram: true,
        targetDate: true,
        budget: true,
        status: true,
        createdAt: true,
        department: {
          select: {
            name: true,
            abbreviation: true,
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        community: {
          select: {
            name: true,
            communityType: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Most recent proposals first
      },
    });

    console.log(`✅ Successfully fetched ${proposals.length} proposals`);
    res.status(200).json({
      success: true,
      message: "Proposals fetched successfully",
      data: proposals,
    });
  } catch (error) {
    console.error("❌ Error fetching proposals:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to fetch proposals");
  }
};

// Get single project proposal
export const getProposalById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📃 Fetching proposal with ID: ${id}`);

    const proposal = await prisma.projectProposal.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        currentApprovalStep: true,
        targetDate: true,
        budget: true,
        targetBeneficiaries: true,
        targetArea: true,
        venue: true,
        createdAt: true,
        department: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        community: {
          select: {
            id: true,
            name: true,
            communityType: true,
            address: true,
            contactPerson: true,
            contactNumber: true,
          },
        },
        bannerProgram: {
          select: {
            name: true,
            description: true,
          },
        },
        attachments: {
          select: {
            fileName: true,
            fileUrl: true,
            fileType: true,
            uploadedAt: true,
          },
        },
        approvals: {
          select: {
            approverPosition: true,
            status: true,
            comment: true,
            approvedAt: true,
            approver: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!proposal) {
      console.log(`❌ Proposal with ID ${id} not found`);
      throw new ApiError(404, "Proposal not found");
    }

    // Transform the data, removing the original approvals array
    const { approvals, ...proposalData } = proposal;
    const transformedProposal = {
      ...proposalData,
      approvalFlow: approvals.map((approval) => ({
        role: approval.approverPosition,
        status: approval.status,
        comment: approval.comment,
        approvedAt: approval.approvedAt,
        approvedBy: approval.approver
          ? `${approval.approver.firstName} ${approval.approver.lastName}`
          : null,
      })),
    };

    console.log(`✅ Successfully fetched proposal: ${proposal.title}`);
    res.status(200).json({
      success: true,
      message: "Proposal fetched successfully",
      data: transformedProposal,
    });
  } catch (error) {
    console.error("❌ Error fetching proposal:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to fetch proposal");
  }
};

// Create new project proposal
export const createProposal: RequestHandler = async (req, res) => {
  try {
    console.log("📝 Creating new proposal...");

    // Parse the JSON data if it's coming as a string
    const proposalData =
      typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body;

    console.log("🔍 Processing proposal data:", proposalData);

    // Get current school year
    const currentSchoolYear = await prisma.schoolYear.findFirst({
      where: {
        isCurrent: true,
      },
    });

    if (!currentSchoolYear) {
      throw new ApiError(400, "No active school year found");
    }

    // Destructure to remove partnerCommunity and use it for community connection
    const { partnerCommunity, ...restData } = proposalData;

    // Ensure the banner program data is properly structured
    const data = {
      ...restData,
      bannerProgram: {
        connect: {
          id: Number(proposalData.bannerProgram.connect.id),
        },
      },
      // Add school year connection
      schoolYear: {
        connect: {
          id: currentSchoolYear.id,
        },
      },
      // Add other necessary field transformations
      budget: new Decimal(proposalData.budget),
      targetDate: new Date(proposalData.targetDate),
      department: {
        connect: {
          id: Number(proposalData.department),
        },
      },
      community: {
        connect: {
          id: Number(partnerCommunity),
        },
      },
      user: {
        connect: {
          id: req.user?.id,
        },
      },
    };

    console.log("Processed data:", data);

    // Create the proposal
    const newProposal = await prisma.projectProposal.create({
      data: {
        ...data,
        approvals: {
          create: [
            {
              approverPosition: "CEC_HEAD",
              status: "PENDING",
            },
            {
              approverPosition: "VP_DIRECTOR",
              status: "PENDING",
            },
            {
              approverPosition: "CHIEF_OPERATION_OFFICER",
              status: "PENDING",
            },
          ],
        },
      },
      include: {
        department: true,
        user: true,
        community: true,
        bannerProgram: true,
        approvals: true,
      },
    });

    // Find CEC HEAD users to notify
    const cecHeadUsers = await prisma.user.findMany({
      where: {
        position: "CEC_HEAD",
        status: "ACTIVE",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    console.log("🔍 CEC HEAD users:", cecHeadUsers);

    // Create notifications for CEC HEAD users
    if (cecHeadUsers.length > 0) {
      await NotificationService.createBulkNotifications(
        cecHeadUsers.map((user) => ({
          title: "New Proposal Requires Review",
          content: `A new proposal "${newProposal.title}" has been submitted and requires your review as CEC Head.`,
          type: "PROPOSAL_STATUS",
          userId: user.id,
          priority: "HIGH",
          proposalId: newProposal.id,
          departmentId: newProposal.departmentId,
          actionUrl: `/admin/community-engagement/project-proposals/${newProposal.id}`,
          actionLabel: "Review Proposal",
        }))
      );

      console.log("✅ Notifications sent to CEC HEAD users");
    } else {
      console.warn("⚠️ No active CEC HEAD users found for notification");
    }

    // Handle file uploads if present
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      console.log(`📎 Processing ${req.files.length} attachments...`);

      try {
        // Check if bucket exists, create if it doesn't
        const { data: buckets } = await supabase.storage.listBuckets();

        const bucketName = "project-proposal-attachments";
        const bucketExists = buckets?.some(
          (bucket) => bucket.name === bucketName
        );

        if (!bucketExists) {
          console.log("Creating storage bucket...");
          const { data: bucketData, error } =
            await supabase.storage.createBucket(bucketName, {
              public: false, // or true based on your needs
              fileSizeLimit: 5242880, // 5MB in bytes
            });

          if (error) throw error;

          console.log("✅ Storage bucket created successfully:", bucketData);
        }

        // Upload files
        const attachments = await Promise.all(
          req.files.map(async (file) => {
            // Log the file object to see its structure
            console.log("File object:", file);

            const fileName = `${Date.now()}-${file.originalname}`;
            const filePath = `proposals/${newProposal.id}/${fileName}`;

            const { data, error } = await supabase.storage
              .from("project-proposal-attachments")
              .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
              });

            if (error) {
              console.error("Upload error:", error);
              throw new ApiError(500, `Failed to upload file: ${error.message}`);
            }

            const {
              data: { publicUrl },
            } = supabase.storage
              .from("project-proposal-attachments")
              .getPublicUrl(filePath);

            // Create new attachment record
            return prisma.projectAttachment.create({
              data: {
                proposalId: newProposal.id,
                fileName: file.originalname,
                fileUrl: publicUrl,
                fileSize: file.size,
                fileType: file.mimetype,
              },
            });
          })
        );

        console.log(`✅ Created ${attachments.length} attachment records`);

        // Return proposal with attachments
        const proposalWithAttachments = await prisma.projectProposal.findUnique(
          {
            where: { id: newProposal.id },
            include: {
              department: true,
              user: true,
              community: true,
              attachments: true,
            },
          }
        );

        res.status(201).json({
          success: true,
          message: "Proposal created successfully with attachments",
          data: proposalWithAttachments,
        });
      } catch (uploadError) {
        console.error("❌ Error handling attachments:", uploadError);

        // Delete the proposal if file upload failed
        await prisma.projectProposal.delete({
          where: { id: newProposal.id },
        });

        throw uploadError;
      }
    } else {
      res.status(201).json({
        success: true,
        message: "Proposal created successfully",
        data: newProposal,
      });
    }
  } catch (error) {
    console.error("❌ Error creating proposal:", error);
    // ... error handling
  }
};

// Update project proposal
export const updateProposal = async (req: Request, res: Response) => {
  try {
    const updatedProposal = await prisma.projectProposal.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...req.body,
        budget: req.body.budget ? new Decimal(req.body.budget) : undefined,
        targetDate: req.body.targetDate
          ? new Date(req.body.targetDate)
          : undefined,
      },
      include: {
        department: true,
        user: true,
        community: true,
      },
    });
    res.status(200).json(updatedProposal);
  } catch (error) {
    res.status(500).json({ message: "Error updating proposal", error });
  }
};

// Delete project proposal
export const deleteProposal = async (req: Request, res: Response) => {
  try {
    await prisma.projectProposal.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(200).json({ message: "Proposal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting proposal", error });
  }
};

// Update proposal status
export const updateProposalStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`📝 Updating proposal ${id} status to ${status}...`);

    // Validate status
    const validStatuses = ["PENDING", "APPROVED", "RETURNED"] as const;
    if (!validStatuses.includes(status)) {
      throw new ApiError(
        400,
        `Invalid status value. Must be one of: ${validStatuses.join(", ")}`
      );
    }

    const updatedProposal = await prisma.projectProposal.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    console.log(`✅ Successfully updated proposal status to ${status}`);
    res.status(200).json({
      success: true,
      message: "Proposal status updated successfully",
      data: updatedProposal,
    });
  } catch (error) {
    console.error("❌ Error updating proposal status:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to update proposal status");
  }
};

// Get departments with minimal program info. Used for dropdowns in proposal form.


// Get proposals by user
export const getProposalsByUser: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log(`📝 Fetching proposals for user ${userId}...`);

    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }

    const proposals = await prisma.projectProposal.findMany({
      where: {
        user: {
          id: userId,
        },
      },
      select: {
        id: true,
        title: true,
        targetDate: true,
        budget: true,
        status: true,
        currentApprovalStep: true,
        community: {
          select: {
            name: true,
          },
        },
        approvals: {
          select: {
            approverPosition: true,
            status: true,
            comment: true,
            approvedAt: true,
            approver: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`✅ Successfully fetched ${proposals.length} proposals`);

    res.status(200).json({
      success: true,
      message: "Proposals fetched successfully",
      data: proposals,
    });
  } catch (error) {
    console.error("❌ Error fetching user proposals:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to fetch user proposals");
  }
};

export const resubmitProposal: RequestHandler = async (req, res) => {
  try {
    const { id: proposalId } = req.params;
    const userId = req.user?.id;

    // Parse the form data if it's coming as a string
    const proposalData =
      typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body.data;

    console.log("🔄 Starting resubmission for proposal:", proposalId);
    console.log("📝 Raw proposal data:", req.body);
    console.log("📝 Parsed proposal data:", proposalData);

    if (!proposalData) {
      throw new ApiError(400, "No proposal data provided");
    }

    // Validate required fields
    if (!proposalData.budget) {
      throw new ApiError(400, "Budget is required");
    }

    // Get the proposal and check if it exists
    const proposal = await prisma.projectProposal.findUnique({
      where: { id: parseInt(proposalId) },
      include: {
        approvals: {
          orderBy: { approvedAt: "desc" },
        },
        attachments: true,
      },
    });

    if (!proposal) {
      throw new ApiError(404, "Proposal not found");
    }

    // Verify that the proposal is in RETURNED status
    if (proposal.status !== "RETURNED") {
      throw new ApiError(400, "Only returned proposals can be resubmitted");
    }

    // Get the last return action
    const returnedApproval = proposal.approvals.find(
      (a) => a.status === "RETURNED"
    );

    if (!returnedApproval) {
      throw new ApiError(400, "No return record found");
    }

    // First, handle database operations
    const updatedProposal = await prisma.projectProposal.update({
      where: { id: proposal.id },
      data: {
        title: proposalData.title,
        description: proposalData.description,
        department: {
          connect: { id: parseInt(proposalData.department) }
        },
        community: {
          connect: { id: parseInt(proposalData.partnerCommunity) }
        },
        targetBeneficiaries: proposalData.targetBeneficiaries,
        targetArea: proposalData.targetArea,
        targetDate: new Date(proposalData.targetDate),
        venue: proposalData.venue,
        budget: new Decimal(proposalData.budget),
        status: "RESUBMITTED",
        currentApprovalStep: returnedApproval.approverPosition,
      },
      include: {
        approvals: {
          include: {
            approver: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { approvedAt: "desc" },
        },
        attachments: true,
      },
    });

    // Update the approval status
    await prisma.projectApproval.update({
      where: {
        proposalId_approverPosition: {
          proposalId: proposal.id,
          approverPosition: returnedApproval.approverPosition,
        },
      },
      data: {
        status: "PENDING",
        approverUserId: null,
        comment: null,
        approvedAt: null,
      },
    });

    // Then handle file uploads if present
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      console.log("📎 Processing file uploads...");
      
      // Delete old files from storage
      for (const attachment of proposal.attachments) {
        const filePath = attachment.fileUrl.split("/").pop();
        if (filePath) {
          const { error } = await supabase.storage
            .from("project-proposal-attachments")
            .remove([`proposals/${proposal.id}/${filePath}`]);

          if (error) {
            console.error("Error deleting old file:", error);
          }
        }
      }

      // Delete old attachment records
      await prisma.projectAttachment.deleteMany({
        where: { proposalId: proposal.id },
      });

      // Upload new files
      for (const file of req.files) {
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = `proposals/${proposal.id}/${fileName}`;

        const { data, error } = await supabase.storage
          .from("project-proposal-attachments")
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
          });

        if (error) {
          console.error("Upload error:", error);
          throw new ApiError(500, `Failed to upload file: ${error.message}`);
        }

        const {
          data: { publicUrl },
        } = supabase.storage
          .from("project-proposal-attachments")
          .getPublicUrl(filePath);

        // Create new attachment record
        await prisma.projectAttachment.create({
          data: {
            proposalId: proposal.id,
            fileName: file.originalname,
            fileUrl: publicUrl,
            fileSize: file.size,
            fileType: file.mimetype,
          },
        });
      }
    }

    // Create notification
    const currentApprover = await prisma.user.findFirst({
      where: {
        position: returnedApproval.approverPosition,
        status: "ACTIVE",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        position: true,
      },
    });

    if (currentApprover) {
      await prisma.notification.create({
        data: {
          title: "Proposal Resubmitted for Review",
          content: `A proposal "${proposalData.title}" has been resubmitted and requires your review.`,
          type: "PROPOSAL_STATUS",
          priority: "HIGH",
          status: "UNREAD",
          userId: currentApprover.id,
          proposalId: proposal.id,
          departmentId: parseInt(proposalData.department),
          actionUrl: `/admin/community-engagement/project-proposals/${proposal.id}`,
          actionLabel: "Review Proposal",
          groupId: `proposal-${proposal.id}-resubmission`,
        },
      });
    }

    // Get the final updated proposal with all changes
    const finalProposal = await prisma.projectProposal.findUnique({
      where: { id: proposal.id },
      include: {
        approvals: {
          include: {
            approver: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { approvedAt: "desc" },
        },
        attachments: true,
      },
    });

    if (!finalProposal) {
      throw new ApiError(404, "Failed to retrieve updated proposal");
    }

    // Format response
    res.status(200).json({
      success: true,
      message: "Proposal resubmitted successfully",
      data: {
        id: finalProposal.id,
        status: finalProposal.status,
        currentStep: finalProposal.currentApprovalStep,
        attachments: finalProposal.attachments,
        revisionHistory: finalProposal.approvals.map((approval) => ({
          role: approval.approverPosition,
          status: approval.status,
          comment: approval.comment,
          actionDate: approval.approvedAt,
          actionBy: approval.approver
            ? `${approval.approver.firstName} ${approval.approver.lastName}`
            : null,
        })),
      },
    });
  } catch (error) {
    console.error("❌ Error resubmitting proposal:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to resubmit proposal");
  }
};
