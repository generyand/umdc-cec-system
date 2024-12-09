import express from "express";
import {
  createActivity,
  getAllActivities,
  getActivityById,
  updateActivity,
//   deleteActivity,
} from "../../controllers/activities.controller.js";

const router = express.Router();

// Route to create a new activity
router.post("/", createActivity);

// Route to get all activities
router.get("/", getAllActivities);

// Route to get a single activity by ID
router.get("/:id", getActivityById);

// Route to update an activity by ID
router.put("/:id", updateActivity);

// Route to delete an activity by ID
// router.delete("/:id", deleteActivity);

export default router; 