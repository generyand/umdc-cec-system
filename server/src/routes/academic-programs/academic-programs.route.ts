import { Router } from "express";
import {
  getAllAcademicPrograms,
  getAcademicProgramById,
  createAcademicProgram,
  updateAcademicProgram,
  deleteAcademicProgram,
} from "../../controllers/academic-programs.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import {
  createAcademicProgramSchema,
  updateAcademicProgramSchema,
} from "../../schemas/academic-program.schema.js";

const router = Router();

router.get("/", getAllAcademicPrograms);
router.get("/:id", getAcademicProgramById);
router.post(
  "/",
  validateRequest(createAcademicProgramSchema),
  createAcademicProgram
);
router.put(
  "/:id",
  validateRequest(updateAcademicProgramSchema),
  updateAcademicProgram
);
router.delete("/:id", deleteAcademicProgram);

export default router;
