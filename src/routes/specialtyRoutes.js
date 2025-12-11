import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { createSpecialty, getAllSpecialties } from "../controllers/specialtyController.js";

const router = express.Router();

router.post("/", protect, adminOnly, createSpecialty);
router.get("/all", getAllSpecialties);

export default router;
