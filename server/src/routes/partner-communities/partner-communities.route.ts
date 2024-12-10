import { Router } from "express";
import {
  getAllCommunities,
  getCommunityById,
} from "../../controllers/partner-communities.controller.js";

const router = Router();

router.get("/", getAllCommunities);
router.get("/:id", getCommunityById);

export default router;
