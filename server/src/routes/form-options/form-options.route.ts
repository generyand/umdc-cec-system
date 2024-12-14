import { Router } from "express";
import { getCreateNewProposalFormOptions } from "../../controllers/form-options.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/get-create-new-proposal-form-options",
  authenticateToken,
  getCreateNewProposalFormOptions
);

export default router;
