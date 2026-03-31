const pool = require('../config/db');

const ItemService = {
  async getAll() {
    const [rows] = await pool.query(`
      SELECT i.*, c.name as category_name
      FROM items i
      JOIN categories c ON i.category_id = c.id
      ORDER BY i.category_id
    `);
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query(
      `SELECT * FROM items WHERE id = ?`,
      [id]
    );
    return rows[0];
  },

  async create(data) {
    const { name, category_id, price } = data;

    const [result] = await pool.query(
      `INSERT INTO items (name, category_id, price)
       VALUES (?, ?, ?)`,
      [name, category_id, price]
    );

    return {
      id: result.insertId,
      name,
      category_id,
      price
    };
  },

  async update(id, data) {
    const { name, category_id, price } = data;

    await pool.query(
      `UPDATE items 
       SET name = ?, category_id = ?, price = ?
       WHERE id = ?`,
      [name, category_id, price, id]
    );

    return { id, name, category_id, price };
  },

  async delete(id) {
    await pool.query(
      `DELETE FROM items WHERE id = ?`,
      [id]
    );

    return { message: 'Deleted successfully' };
  }
};

module.exports = ItemService;