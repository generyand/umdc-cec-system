import { Router } from "express";
import {
  approveProposal,
  getProposalsForApproval,
  // getProposalApprovalById,
  // approveProposal,
  // rejectProposal,
  // getApprovalHistory,
} from "../../controllers/approvals.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = Router();

// Get all proposals that need the current user's approval
router.get("/", authenticateToken, getProposalsForApproval);

// Get specific proposal approval details
// router.get("/:id", authenticateToken, getProposalApprovalById);

// Get approval history for a proposal
// router.get("/:id/history", authenticateToken, getApprovalHistory);

// Approve a proposal
router.post("/:id/approve", authenticateToken, approveProposal);

// Reject a proposal
// router.post("/:id/reject", authenticateToken, rejectProposal);

export default router;
