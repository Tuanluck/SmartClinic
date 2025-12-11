import db from "../config/db.js";

export const getMe = async (req, res) => {
  try {
    const [user] = await db.query(
      "SELECT id, name, email, phone, birthday, gender, avatar FROM users WHERE id = ?",
      [req.user.id]
    );

    res.json(user[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { name, phone, birthday, gender, avatar } = req.body;

  try {
    await db.query(
      `UPDATE users SET name=?, phone=?, birthday=?, gender=?, avatar=? WHERE id=?`,
      [name, phone, birthday, gender, avatar, req.user.id]
    );

    res.json({ message: "Cập nhật thành công!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
