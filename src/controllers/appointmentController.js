import db from "../config/db.js";

/**
 * USER ĐẶT LỊCH KHÁM
 * POST /api/appointments
 */
export const createAppointment = async (req, res) => {
  try {
    const patient_id = req.user.id;
    const { doctor_id, schedule_id, reason } = req.body;

    // 1. Kiểm tra schedule có tồn tại
    const [schedule] = await db.query(
      "SELECT * FROM doctor_schedules WHERE id = ?",
      [schedule_id]
    );

    if (schedule.length === 0) {
      return res.status(400).json({ message: "Schedule not found" });
    }

    if (!schedule[0].is_available) {
      return res.status(400).json({ message: "This schedule is not available" });
    }

    // 2. Check lịch đó có thuộc đúng bác sĩ không
    if (schedule[0].doctor_id !== doctor_id) {
      return res.status(400).json({
        message: "This schedule does not belong to this doctor",
      });
    }

    // 3. Check user chưa đặt trùng schedule
    const [duplicate] = await db.query(
      "SELECT id FROM appointments WHERE patient_id=? AND schedule_id=?",
      [patient_id, schedule_id]
    );

    if (duplicate.length > 0) {
      return res
        .status(400)
        .json({ message: "You already booked this schedule" });
    }

    // 4. Insert appointment
    await db.query(
      `INSERT INTO appointments (patient_id, doctor_id, schedule_id, reason)
       VALUES (?, ?, ?, ?)`,
      [patient_id, doctor_id, schedule_id, reason || null]
    );

    // 5. Khoá lịch lại
    await db.query(
      "UPDATE doctor_schedules SET is_available = FALSE WHERE id = ?",
      [schedule_id]
    );

    res.json({ message: "Đặt lịch khám thành công!" });
  } catch (error) {
    console.error("createAppointment ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * USER XEM LỊCH HẸN CỦA MÌNH
 * GET /api/appointments/my
 */
export const getMyAppointments = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [rows] = await db.query(
      `SELECT a.id AS appointment_id, a.status, a.reason, a.created_at,
              d.id AS doctor_id, u.name AS doctor_name, s.date, s.start_time, s.end_time
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       JOIN users u ON d.user_id = u.id
       JOIN doctor_schedules s ON a.schedule_id = s.id
       WHERE a.patient_id = ?
       ORDER BY a.created_at DESC`,
      [user_id]
    );

    res.json(rows);
  } catch (error) {
    console.error("getMyAppointments ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * USER HỦY LỊCH
 * PUT /api/appointments/cancel/:id
 */
export const cancelAppointment = async (req, res) => {
  try {
    const appointment_id = req.params.id;

    // Check appointment exists
    const [rows] = await db.query("SELECT * FROM appointments WHERE id = ?", [
      appointment_id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Only pending can cancel
    if (rows[0].status !== "pending") {
      return res.status(400).json({
        message: "Only pending appointments can be cancelled",
      });
    }

    // Cancel
    await db.query(
      "UPDATE appointments SET status='cancelled' WHERE id=?",
      [appointment_id]
    );

    // Unlock schedule
    await db.query(
      "UPDATE doctor_schedules SET is_available=TRUE WHERE id=?",
      [rows[0].schedule_id]
    );

    res.json({ message: "Hủy lịch thành công!" });
  } catch (error) {
    console.error("cancelAppointment ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * DOCTOR XEM LỊCH HẸN CỦA MÌNH
 * GET /api/appointments/doctor/my
 */
export const getDoctorAppointments = async (req, res) => {
  try {
    const doctor_user_id = req.user.id;

    // Tìm doctor_id dựa trên user_id
    const [doctor] = await db.query(
      "SELECT id FROM doctors WHERE user_id = ?",
      [doctor_user_id]
    );

    if (doctor.length === 0) {
      return res.status(400).json({ message: "Doctor profile not found" });
    }

    const doctor_id = doctor[0].id;

    const [rows] = await db.query(
      `SELECT a.id AS appointment_id, a.status, a.reason,
              u.name AS patient_name,
              s.date, s.start_time, s.end_time
       FROM appointments a
       JOIN users u ON a.patient_id = u.id
       JOIN doctor_schedules s ON a.schedule_id = s.id
       WHERE a.doctor_id = ?
       ORDER BY s.date ASC`,
      [doctor_id]
    );

    res.json(rows);
  } catch (error) {
    console.error("getDoctorAppointments ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * DOCTOR DUYỆT LỊCH
 * PUT /api/appointments/approve/:id
 */
export const approveAppointment = async (req, res) => {
  try {
    await db.query(
      "UPDATE appointments SET status='approved' WHERE id=?",
      [req.params.id]
    );

    res.json({ message: "Lịch hẹn đã được duyệt!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * DOCTOR TỪ CHỐI LỊCH
 * PUT /api/appointments/reject/:id
 */
export const rejectAppointment = async (req, res) => {
  try {
    await db.query(
      "UPDATE appointments SET status='cancelled' WHERE id=?",
      [req.params.id]
    );

    res.json({ message: "Lịch đã bị từ chối!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
