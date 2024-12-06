import { Request, Response, RequestHandler } from "express";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/errors.js";
// import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { createClient } from "@supabase/supabase-js";

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
        program: {
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

    const proposalData = JSON.parse(req.body.data);
    console.log("🔍 Processing proposal data:", proposalData);

    // Create the proposal first
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
          connect: { id: Number(proposalData.program) },
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
          const { data, error } = await supabase.storage.createBucket(
            bucketName,
            {
              public: false, // or true based on your needs
              fileSizeLimit: 5242880, // 5MB in bytes
            }
          );

          if (error) throw error;
        }

        // Upload files
        const attachments = await Promise.all(
          req.files.map(async (file) => {
            const fileName = `${Date.now()}-${file.originalname}`;
            const filePath = `proposals/${newProposal.id}/${fileName}`;

            console.log("Attempting to upload file:", fileName);

            // Upload to Supabase with error logging
            const { data, error } = await supabase.storage
              .from("project-proposal-attachments")
              .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
              });

            if (error) {
              console.error("❌ Detailed upload error:", {
                error,
                fileName,
                filePath,
                fileSize: file.size,
                mimeType: file.mimetype,
              });
              throw new ApiError(
                500,
                `Failed to upload file: ${error.message}`
              );
            }

            console.log("✅ File uploaded successfully:", filePath);

            // Get public URL
            const {
              data: { publicUrl },
            } = supabase.storage
              .from("project-proposal-attachments")
              .getPublicUrl(filePath);

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

        // Return proposal with attachments
        const proposalWithAttachments = await prisma.projectProposal.findUnique(
          {
            where: { id: newProposal.id },
            include: {
              department: true,
              program: true,
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
