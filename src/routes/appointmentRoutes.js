import express from "express";
import {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
  getDoctorAppointments,
  approveAppointment,
  rejectAppointment,
} from "../controllers/appointmentController.js";

import { protect, adminOnly, doctorOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// USER: đặt lịch
router.post("/", protect, createAppointment);

// USER: xem lịch của mình
router.get("/my", protect, getMyAppointments);

// USER: hủy lịch
router.put("/cancel/:id", protect, cancelAppointment);

// DOCTOR: xem lịch hẹn
router.get("/doctor/my", protect, doctorOnly, getDoctorAppointments);

// DOCTOR: duyệt / từ chối
router.put("/approve/:id", protect, doctorOnly, approveAppointment);
router.put("/reject/:id", protect, doctorOnly, rejectAppointment);

export default router;
