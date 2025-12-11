import express from "express";
import {
  createSchedule,
  getScheduleByDoctor,
  updateSchedule,
} from "../controllers/scheduleController.js";

import { protect, adminOnly, doctorOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Doctor hoặc Admin tạo schedule
router.post("/", protect, createSchedule);

// Lấy lịch của 1 bác sĩ
router.get("/doctor/:doctor_id", getScheduleByDoctor);

// Admin hoặc Doctor update schedule
router.put("/:id", protect, updateSchedule);

export default router;
