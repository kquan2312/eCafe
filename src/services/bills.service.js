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

    const [result] = await pool.query(
      `INSERT INTO bills (table_id, total, status)
       VALUES (?, 0, 'open')`,
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