import { Request, Response, RequestHandler } from "express";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/errors.js";
import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import supabase from "../config/supbase.config.js";

// Add multer types
interface RequestWithFiles extends Request {
  files?: Express.Multer.File[];
}

// Add this interface to extend the Request type
interface MulterRequest extends Request {
  files: Express.Multer.File[];
}

// Get all project proposals
export const getAllProposals: RequestHandler = async (req, res) => {
  try {
    console.log("📃 Fetching all proposals...");
    const proposals = await prisma.projectProposal.findMany({
      include: {
        department: true,
        program: true,
        user: true,
        community: true,
        attachments: true,
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
      include: {
        department: true,
        program: true,
        user: true,
        community: true,
        attachments: true,
      },
    });

    if (!proposal) {
      console.log(`❌ Proposal with ID ${id} not found`);
      throw new ApiError(404, "Proposal not found");
    }

    console.log(`✅ Successfully fetched proposal: ${proposal.title}`);
    res.status(200).json({
      success: true,
      message: "Proposal fetched successfully",
      data: proposal,
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
    console.log("Received request body:", req.body);

    // Validate required fields
    if (!req.body.data) {
      throw new ApiError(400, "Proposal data is required");
    }

    // Parse the proposal data
    const proposalData = JSON.parse(req.body.data);
    console.log("🔍 Processing proposal data:", proposalData);

    // Validate essential fields
    if (!proposalData.budget) {
      throw new ApiError(400, "Budget is required");
    }

    if (!proposalData.department) {
      throw new ApiError(400, "Department is required");
    }

    if (!proposalData.program) {
      throw new ApiError(400, "Program is required");
    }

    // Create the proposal
    const newProposal = await prisma.projectProposal.create({
      data: {
        title: proposalData.title,
        description: proposalData.description,
        budget: new Decimal(proposalData.budget),
        targetDate: new Date(proposalData.targetDate),
        venue: proposalData.venue,
        targetArea: proposalData.targetArea,
        targetBeneficiaries: proposalData.targetBeneficiaries,
        bannerProgram: proposalData.bannerProgram,
        department: {
          connect: { id: parseInt(proposalData.department) },
        },
        program: {
          connect: { id: parseInt(proposalData.program) },
        },
        user: {
          connect: { id: req.user?.id },
        },
        community: {
          connect: { id: parseInt(proposalData.partnerCommunity) },
        },
      },
      include: {
        department: true,
        program: true,
        user: true,
        community: true,
      },
    });

    console.log(`✅ Proposal created with ID: ${newProposal.id}`);

    // Handle file uploads if present
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      console.log(`📎 Processing ${req.files.length} attachments...`);

      const attachments = await Promise.all(
        req.files.map(async (file) => {
          const fileName = `${Date.now()}-${file.originalname}`;

          // Upload to Supabase
          const { data, error } = await supabase.storage
            .from("project-attachments")
            .upload(`proposals/${newProposal.id}/${fileName}`, file.buffer, {
              contentType: file.mimetype,
            });

          if (error) {
            console.error("❌ File upload error:", error);
            throw new ApiError(500, "Failed to upload file");
          }

          // Get public URL
          const {
            data: { publicUrl },
          } = supabase.storage
            .from("project-attachments")
            .getPublicUrl(`proposals/${newProposal.id}/${fileName}`);

          // Create attachment record
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

      // Fetch the complete proposal with attachments
      const proposalWithAttachments = await prisma.projectProposal.findUnique({
        where: { id: newProposal.id },
        include: {
          department: true,
          program: true,
          user: true,
          community: true,
          attachments: true,
        },
      });

      res.status(201).json({
        success: true,
        message: "Proposal created successfully with attachments",
        data: proposalWithAttachments,
      });
    } else {
      res.status(201).json({
        success: true,
        message: "Proposal created successfully",
        data: newProposal,
      });
    }
  } catch (error) {
    console.error("❌ Error creating proposal:", error);

    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({
        success: false,
        message: "Invalid proposal data",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to create proposal",
      error: error instanceof Error ? error.message : "Unknown error",
    });
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
        program: true,
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
