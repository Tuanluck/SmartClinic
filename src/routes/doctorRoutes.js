import express from "express";
import {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
} from "../controllers/doctorController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// PUBLIC
router.get("/", getDoctors);
router.get("/:id", getDoctorById);

// ADMIN
router.post("/", protect, adminOnly, createDoctor);
router.put("/:id", protect, adminOnly, updateDoctor);

export default router;
