import jwt from "jsonwebtoken";
import db from "../config/db.js";

// 🔐 Kiểm tra đăng nhập
export const protect = async (req, res, next) => {
  try {
    let token;

    // Lấy token từ header Authorization: Bearer xxx
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kiểm tra xem user có còn tồn tại trong DB hay không
    const [rows] = await db.query("SELECT id, role FROM users WHERE id = ?", [
      decoded.id,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    // Gán thông tin user vào req
    req.user = rows[0]; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

// 🔒 Chỉ Admin mới được truy cập
export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin privilege required" });
  }
  next();
};

// 🩺 Chỉ Doctor mới được truy cập
export const doctorOnly = (req, res, next) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ message: "Doctor privilege required" });
  }
  next();
};
