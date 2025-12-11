import express from "express";
import pool from "./config/db.js"; // đã chuẩn default export
import authRoutes from "../src/routes/authRoutes.js";
import userRoutes from "../src/routes/userRoutes.js";
import medicalRoutes from "../src/routes/medicalRoutes.js";
import specialtyRoutes from "../src/routes/specialtyRoutes.js";
import doctorRoutes from "../src/routes/doctorRoutes.js";
import scheduleRoutes from "../src/routes/scheduleRoutes.js";
import appointmentRoutes from "../src/routes/appointmentRoutes.js"

import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Ví dụ test query
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SHOW TABLES");
    res.json({ tables: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/medical", medicalRoutes);
app.use("/api/specialties", specialtyRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/appointments", appointmentRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
