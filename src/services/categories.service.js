const pool = require("../config/db");
const CategoryService = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM categories');
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  async create(data) {
    const { name, type } = data;

    const [result] = await pool.query(
      'INSERT INTO categories (name, type) VALUES (?, ?)',
      [name, type]
    );

    return {
      id: result.insertId,
      ...data
    };
  },

  async update(id, data) {
    const { name, type } = data;

    await pool.query(
      'UPDATE categories SET name = ?, type = ? WHERE id = ?',
      [name, type, id]
    );

    return { id, ...data };
  },

  async delete(id) {
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    return { message: 'Deleted successfully' };
  }
};

module.exports = CategoryService;