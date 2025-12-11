import db from "../config/db.js";

/**
 * Tạo lịch làm việc cho bác sĩ
 * POST /api/schedules
 * Body: doctor_id, date, start_time, end_time
 */
export const createSchedule = async (req, res) => {
  try {
    const { doctor_id, date, start_time, end_time } = req.body;

    // Check doctor exist
    const [doctorExists] = await db.query(
      "SELECT id FROM doctors WHERE id = ?",
      [doctor_id]
    );

    if (doctorExists.length === 0) {
      return res.status(400).json({ message: "Doctor not found" });
    }

    await db.query(
      `INSERT INTO doctor_schedules (doctor_id, date, start_time, end_time)
       VALUES (?, ?, ?, ?)`,
      [doctor_id, date, start_time, end_time]
    );

    res.json({ message: "Tạo lịch làm việc thành công!" });
  } catch (error) {
    console.error("createSchedule ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy lịch của 1 bác sĩ
 * GET /api/schedules/doctor/:doctor_id
 */
export const getScheduleByDoctor = async (req, res) => {
  try {
    const doctor_id = req.params.doctor_id;

    const [rows] = await db.query(
      `SELECT * FROM doctor_schedules 
       WHERE doctor_id = ? 
       ORDER BY date ASC, start_time ASC`,
      [doctor_id]
    );

    res.json(rows);
  } catch (error) {
    console.error("getScheduleByDoctor ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Cập nhật lịch (doctor hoặc admin)
 * PUT /api/schedules/:id
 */
export const updateSchedule = async (req, res) => {
  try {
    const id = req.params.id;

    const { date, start_time, end_time, is_available } = req.body;

    const [exists] = await db.query(
      "SELECT id FROM doctor_schedules WHERE id=?",
      [id]
    );

    if (exists.length === 0) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    await db.query(
      `UPDATE doctor_schedules 
       SET date=?, start_time=?, end_time=?, is_available=?
       WHERE id=?`,
      [date, start_time, end_time, is_available, id]
    );

    res.json({ message: "Cập nhật lịch thành công!" });
  } catch (error) {
    console.error("updateSchedule ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};
