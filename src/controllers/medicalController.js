import db from "../config/db.js";

// 🟢 Lấy hồ sơ y tế
export const getMedical = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log("== DEBUG ==");
    console.log("User ID:", userId);

    const [rows] = await db.query(
      "SELECT medical_history, allergies, medications, notes FROM medical_profiles WHERE user_id = ?",
      [userId]
    );

    console.log("SQL Result:", rows);

    if (rows.length === 0) {
      return res.json({
        medical_history: "",
        allergies: "",
        medications: "",
        notes: ""
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Medical GET ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// 🟡 Cập nhật hồ sơ y tế
export const updateMedical = async (req, res) => {
  const { medical_history, allergies, medications, notes } = req.body;

  try {
    const userId = req.user.id;

    const [exists] = await db.query(
      "SELECT id FROM medical_profiles WHERE user_id = ?",
      [userId]
    );

    // Nếu chưa có hồ sơ → tự tạo
    if (exists.length === 0) {
      await db.query(
        `INSERT INTO medical_profiles (user_id, medical_history, allergies, medications, notes)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, medical_history, allergies, medications, notes]
      );
    } else {
      // Nếu có rồi → update
      await db.query(
        `UPDATE medical_profiles 
         SET medical_history=?, allergies=?, medications=?, notes=? 
         WHERE user_id=?`,
        [medical_history, allergies, medications, notes, userId]
      );
    }

    res.json({ message: "Cập nhật hồ sơ y tế thành công!" });
  } catch (error) {
    console.error("Medical UPDATE ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
};
