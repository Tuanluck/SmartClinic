import mysql from "mysql2/promise"; // dùng promise để await kết nối
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test kết nối khi khởi động server
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Database connected successfully!");
    conn.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
})();

export default pool;
