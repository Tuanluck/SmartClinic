import db from "../config/db.js";

export const createSpecialty = async (req, res) => {
  const { name, description } = req.body;

  try {
    await db.query(
      `INSERT INTO specialties (name, description) VALUES (?, ?)`,
      [name, description]
    );

    res.json({ message: "Tạo chuyên khoa thành công!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllSpecialties = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM specialties");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
