import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import { generateToken } from "../utils/generateToken.js";

// REGISTER
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (user.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role || "user"]
    );

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (user.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user[0].id, user[0].role);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        role: user[0].role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
