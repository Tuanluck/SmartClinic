import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMedical, updateMedical } from "../controllers/medicalController.js";

const router = express.Router();

// GET hồ sơ y tế: /api/medical
router.get("/", protect, getMedical);

// UPDATE hồ sơ y tế: /api/medical/update
router.put("/update", protect, updateMedical);

export default router;
