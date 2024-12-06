import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import supabase from "../config/supbase.config.js";

const prisma = new PrismaClient();

// Get all project proposals
export const getAllProposals = async (req: Request, res: Response) => {
  try {
    const proposals = await prisma.projectProposal.findMany({
      include: {
        department: true,
        program: true,
        user: true,
        community: true,
        attachments: true,
      },
    });
    res.status(200).json(proposals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching proposals", error });
  }
};

// Get single project proposal by ID
export const getProposalById = async (req: Request, res: Response) => {
  try {
    const proposal = await prisma.projectProposal.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        department: true,
        program: true,
        user: true,
        community: true,
        attachments: true,
      },
    });
    if (!proposal) {
      res.status(404).json({ message: "Proposal not found" });
    }
    res.status(200).json(proposal);
    return;
  } catch (error) {
    res.status(500).json({ message: "Error fetching proposal", error });
  }
};

// Create new project proposal
export const createProposal = async (req: Request, res: Response) => {
  try {
    const { files, department, program, ...proposalData } = req.body;

    // 1. Create the proposal first with proper relations
    const newProposal = await prisma.projectProposal.create({
      data: {
        ...proposalData,
        budget: new Decimal(proposalData.budget),
        targetDate: new Date(proposalData.targetDate),
        department: {
          connect: { id: parseInt(department) },
        },
        program: {
          connect: { id: parseInt(program) },
        },
        // Assuming you have the user ID from the auth middleware
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

    // 2. Handle file uploads if any files are present
    if (files && files.length > 0) {
      const attachmentPromises = files.map(async (file: any) => {
        // Upload file to Supabase Storage
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from("project-attachments")
          .upload(`proposals/${newProposal.id}/${fileName}`, file.buffer, {
            contentType: file.mimetype,
          });

        if (error) throw error;

        // Get public URL for the uploaded file
        const {
          data: { publicUrl },
        } = supabase.storage
          .from("project-attachments")
          .getPublicUrl(`proposals/${newProposal.id}/${fileName}`);

        // Create attachment record in database
        return prisma.projectAttachment.create({
          data: {
            proposalId: newProposal.id,
            fileName: file.name,
            fileUrl: publicUrl,
            fileSize: file.size,
            fileType: file.mimetype,
          },
        });
      });

      // Wait for all attachments to be processed
      await Promise.all(attachmentPromises);

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

      res.status(201).json(proposalWithAttachments);
    } else {
      res.status(201).json(newProposal);
    }
  } catch (error) {
    console.error("Proposal creation error:", error);
    res.status(500).json({
      message: "Error creating proposal",
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
