// Backend Routes
import express from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import {
  getAllProposals,
  getProposalById,
  createProposal,
  updateProposal,
  deleteProposal,
  updateProposalStatus,
  getProposalsByUser,
  resubmitProposal,
} from "../../controllers/project-proposals.controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

// Get all proposals (with filters)
router.get("/", authenticateToken, getAllProposals);

// Get single proposal
router.get("/:id", authenticateToken, getProposalById);

// Create new proposal
router.post("/", authenticateToken, upload.array("files"), createProposal);

// Update proposal
router.patch("/:id", authenticateToken, updateProposal);

// Delete proposal
router.delete("/:id", authenticateToken, deleteProposal);

// Update proposal status
router.patch("/:id/status", authenticateToken, updateProposalStatus);

// Get proposals by user
router.get("/user/:userId", authenticateToken, getProposalsByUser);

// Resubmit proposal
router.put("/:id/resubmit", authenticateToken, upload.array("files"), resubmitProposal);

export default router;
