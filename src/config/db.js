const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "e_cafe",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 6868, // 🔥 dùng port từ env
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 🔥 Test connection ngay khi require
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ MySQL connected successfully!");
    conn.release();
  } catch (err) {
    console.error("❌ MySQL connection failed:", err);
    process.exit(1); // dừng server luôn nếu fail
  }
})();

module.exports = pool;