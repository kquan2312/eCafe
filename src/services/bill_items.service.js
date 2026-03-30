const pool = require('../config/db');

const BillItemService = {
  // 👉 Lấy tất cả item theo bill
  async getByBillId(bill_id) {
    const [rows] = await pool.query(`
      SELECT bi.*, i.name
      FROM bill_items bi
      JOIN items i ON bi.item_id = i.id
      WHERE bi.bill_id = ?
    `, [bill_id]);

    return rows;
  },

  // 👉 Thêm món vào bill
  async addItem(bill_id, item_id, quantity = 1) {
    // 1. Lấy giá hiện tại của item
    const [[item]] = await pool.query(
      'SELECT price FROM items WHERE id = ?',
      [item_id]
    );

    if (!item) throw new Error('Item not found');

    // 2. Check đã có trong bill chưa
    const [[existing]] = await pool.query(
      `SELECT * FROM bill_items 
       WHERE bill_id = ? AND item_id = ?`,
      [bill_id, item_id]
    );

    if (existing) {
      // 👉 Nếu có rồi → tăng số lượng
      await pool.query(
        `UPDATE bill_items 
         SET quantity = quantity + ?
         WHERE id = ?`,
        [quantity, existing.id]
      );
    } else {
      // 👉 Nếu chưa có → insert mới
      await pool.query(
        `INSERT INTO bill_items (bill_id, item_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [bill_id, item_id, quantity, item.price]
      );
    }

    // 🔥 Update total bill
    await this.updateBillTotal(bill_id);
  },

  // 👉 Update số lượng
  async updateQuantity(id, quantity) {
    await pool.query(
      `UPDATE bill_items SET quantity = ? WHERE id = ?`,
      [quantity, id]
    );

    // lấy bill_id để update total
    const [[row]] = await pool.query(
      'SELECT bill_id FROM bill_items WHERE id = ?',
      [id]
    );

    await this.updateBillTotal(row.bill_id);
  },

  // 👉 Xoá món
  async delete(id) {
    const [[row]] = await pool.query(
      'SELECT bill_id FROM bill_items WHERE id = ?',
      [id]
    );

    await pool.query(
      'DELETE FROM bill_items WHERE id = ?',
      [id]
    );

    await this.updateBillTotal(row.bill_id);
  },

  // 🔥 TÍNH TOTAL BILL (QUAN TRỌNG NHẤT)
  async updateBillTotal(bill_id) {
    const [[result]] = await pool.query(`
      SELECT SUM(quantity * price) as total
      FROM bill_items
      WHERE bill_id = ?
    `, [bill_id]);

    const total = result.total || 0;

    await pool.query(
      `UPDATE bills SET total = ? WHERE id = ?`,
      [total, bill_id]
    );
  }
};

module.exports = BillItemService;