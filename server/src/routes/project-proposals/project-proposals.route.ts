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
  //   getProposalsByDepartment,
  //   getProposalsByStatus,
  //   getProposalsByUser,
  //   updateProposalStatus,
  //   addProposalAttachments,
  //   removeProposalAttachment,
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

// Optional: Additional routes based on your needs
// Get proposals by department
// router.get(
//   "/department/:departmentId",
//   isAuthenticated,
// getProposalsByDepartment
// );

// // Get proposals by status
// router.get("/status/:status", isAuthenticated, getProposalsByStatus);

// // Get proposals by user
// router.get("/user/:userId", isAuthenticated, getProposalsByUser);

// // Update proposal status
// router.patch("/:id/status", isAuthenticated, updateProposalStatus);

// // Add attachments to proposal
// router.post("/:id/attachments", isAuthenticated, addProposalAttachments);

// // Remove attachment from proposal
// router.delete(
//   "/:id/attachments/:attachmentId",
//   isAuthenticated,
//   removeProposalAttachment
// );

export default router;
