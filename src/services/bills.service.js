const pool = require('../config/db');

const BillService = {
  async getAll() {
    const [rows] = await pool.query(`
      SELECT b.*, t.name as table_name
      FROM bills b
      JOIN tables t ON b.table_id = t.id
    `);
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query(
      `SELECT * FROM bills WHERE id = ?`,
      [id]
    );
    return rows[0];
  },

  async create(data) {
  const { table_id } = data;

  // 1. Check bàn tồn tại
  const [[table]] = await pool.query(
    'SELECT * FROM tables WHERE id = ?',
    [table_id]
  );

  if (!table) {
    throw new Error('Table not found');
  }

  // 2. Check đã có bill open chưa
  const [existing] = await pool.query(
    `SELECT * FROM bills 
     WHERE table_id = ? AND status = 'open'`,
    [table_id]
  );

  if (existing.length) {
    return existing[0]; // dùng lại bill cũ
  }

  // 3. Tạo bill mới
  const [result] = await pool.query(
    `INSERT INTO bills (table_id, total, status)
     VALUES (?, 0, 'open')`,
    [table_id]
  );

  // 4. Update trạng thái bàn
  await pool.query(
    `UPDATE tables SET status = 'occupied' WHERE id = ?`,
    [table_id]
  );

  return {
    id: result.insertId,
    table_id,
    total: 0,
    status: 'open'
  };
},

  async update(id, data) {
    const { table_id, total, status } = data;

    await pool.query(
      `UPDATE bills 
       SET table_id = ?, total = ?, status = ?
       WHERE id = ?`,
      [table_id, total, status, id]
    );

    return { id, table_id, total, status };
  },

  async delete(id) {
    await pool.query(
      `DELETE FROM bills WHERE id = ?`,
      [id]
    );

    return { message: 'Deleted successfully' };
  }
};

module.exports = BillService;   