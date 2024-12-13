import { Router } from "express";
import {
  approveProposal,
  getProposalsForApproval,
  returnProposal,
} from "../../controllers/approvals.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = Router();

// Get all proposals that need the current user's approval
router.get("/", authenticateToken, getProposalsForApproval);

// Approve a proposal
router.post("/:id/approve", authenticateToken, approveProposal);

// Return a proposal
router.post("/:id/return", authenticateToken, returnProposal);

export default router;
