// Backend Routes
import express from "express";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
import {
  getAllProposals,
  getProposalById,
  createProposal,
  updateProposal,
  deleteProposal,
  //   getProposalsByDepartment,
  //   getProposalsByStatus,
  //   getProposalsByUser,
  //   updateProposalStatus,
  //   addProposalAttachments,
  //   removeProposalAttachment,
} from "../../controllers/project-proposals.controller.js";

const router = express.Router();

// Get all proposals (with filters)
router.get("/", isAuthenticated, getAllProposals);

// Get single proposal
router.get("/:id", isAuthenticated, getProposalById);

// Create new proposal
router.post("/", isAuthenticated, createProposal);

// Update proposal
router.patch("/:id", isAuthenticated, updateProposal);

// Delete proposal
router.delete("/:id", isAuthenticated, deleteProposal);

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
