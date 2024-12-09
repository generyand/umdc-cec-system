import { Router } from "express";
import { getAllCommunities } from "../../controllers/partner-communities.controller.js";

const router = Router();

router.get("/", getAllCommunities);

export default router;
