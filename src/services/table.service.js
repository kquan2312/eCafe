const pool = require("../config/db");

class TableService {
  // Tạo bàn mới
  static async createTable(name) {
    const [result] = await pool.execute(
      "INSERT INTO tables (name) VALUES (?)",
      [name]
    );
    return result;
  }

  // Lấy tất cả bàn
  static async getAllTables() {
    const [rows] = await pool.execute("SELECT * FROM tables");
    return rows;
  }

  // Lấy bàn theo id
  static async getTableById(id) {
    const [rows] = await pool.execute("SELECT * FROM tables WHERE id = ?", [id]);
    return rows[0];
  }

  // Cập nhật trạng thái bàn
  static async updateTableStatus(id, status) {
    const [result] = await pool.execute(
      "UPDATE tables SET status = ? WHERE id = ?",
      [status, id]
    );
    return result;
  }

  // Xóa bàn
  static async deleteTable(id) {
    const [result] = await pool.execute("DELETE FROM tables WHERE id = ?", [id]);
    return result;
  }
}

module.exports = TableService;