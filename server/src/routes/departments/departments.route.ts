import { Router } from "express";
import {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../controllers/departments.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
} from "schemas/department.schema.js";

const router = Router();

router.get("/", getAllDepartments);
router.get("/:id", getDepartmentById);
router.post("/", validateRequest(createDepartmentSchema), createDepartment);
router.put("/:id", validateRequest(updateDepartmentSchema), updateDepartment);
router.delete("/:id", deleteDepartment);

export default router;
