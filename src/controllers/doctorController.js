import db from "../config/db.js";

/**
 * LẤY DANH SÁCH BÁC SĨ
 * GET /api/doctors
 */
export const getDoctors = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
          d.id AS doctor_id,
          u.id AS user_id,
          u.name AS doctor_name,
          u.email AS doctor_email,
          u.avatar AS doctor_avatar,
          s.id AS specialty_id,
          s.name AS specialty_name,
          d.description,
          d.years_experience,
          d.work_time,
          d.rating
        FROM doctors d
        LEFT JOIN users u ON d.user_id = u.id
        LEFT JOIN specialties s ON d.specialty_id = s.id
        ORDER BY d.id DESC`
    );

    res.json(rows);
  } catch (error) {
    console.error("getDoctors ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * LẤY CHI TIẾT 1 BÁC SĨ
 * GET /api/doctors/:id
 */
export const getDoctorById = async (req, res) => {
  try {
    const id = req.params.id;

    const [rows] = await db.query(
      `SELECT 
          d.id AS doctor_id,
          u.id AS user_id,
          u.name AS doctor_name,
          u.email AS doctor_email,
          u.avatar AS doctor_avatar,
          s.id AS specialty_id,
          s.name AS specialty_name,
          d.description,
          d.years_experience,
          d.work_time,
          d.rating
        FROM doctors d
        LEFT JOIN users u ON d.user_id = u.id
        LEFT JOIN specialties s ON d.specialty_id = s.id
        WHERE d.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("getDoctorById ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * TẠO BÁC SĨ (ADMIN)
 * POST /api/doctors
 */
export const createDoctor = async (req, res) => {
  try {
    const { user_id, specialty_id, description, years_experience, work_time } =
      req.body;

    // Kiểm tra user có tồn tại không
    const [userRows] = await db.query(
      "SELECT id, role FROM users WHERE id = ?",
      [user_id]
    );

    if (userRows.length === 0) {
      return res.status(400).json({ message: "User does not exist" });
    }

    if (userRows[0].role !== "doctor") {
      return res
        .status(400)
        .json({ message: "User role must be 'doctor' to create doctor profile" });
    }

    // Kiểm tra specialty có tồn tại
    const [specRows] = await db.query(
      "SELECT id FROM specialties WHERE id = ?",
      [specialty_id]
    );
    if (specRows.length === 0) {
      return res.status(400).json({ message: "Specialty not found" });
    }

    // Insert
    await db.query(
      `INSERT INTO doctors 
        (user_id, specialty_id, description, years_experience, work_time) 
        VALUES (?, ?, ?, ?, ?)`,
      [
        user_id,
        specialty_id,
        description || null,
        years_experience || null,
        work_time || null,
      ]
    );

    res.json({ message: "Doctor created successfully!" });
  } catch (error) {
    console.error("createDoctor ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * CẬP NHẬT BÁC SĨ
 * PUT /api/doctors/:id
 */
export const updateDoctor = async (req, res) => {
  try {
    const doctor_id = req.params.id;

    const {
      specialty_id,
      description,
      years_experience,
      work_time,
      rating,
    } = req.body;

    const [rows] = await db.query("SELECT id FROM doctors WHERE id = ?", [
      doctor_id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    await db.query(
      `UPDATE doctors 
         SET specialty_id=?, description=?, years_experience=?, work_time=?, rating=?
         WHERE id=?`,
      [
        specialty_id || null,
        description || null,
        years_experience || null,
        work_time || null,
        rating || null,
        doctor_id,
      ]
    );

    res.json({ message: "Doctor updated successfully!" });
  } catch (error) {
    console.error("updateDoctor ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};
