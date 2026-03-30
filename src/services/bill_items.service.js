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
  if (quantity <= 0) throw new Error('Invalid quantity');

  const [[bill]] = await pool.query(
    `SELECT * FROM bills WHERE id = ? AND status = 'open'`,
    [bill_id]
  );
  if (!bill) throw new Error('Bill is not open');

  const [[item]] = await pool.query(
    `SELECT * FROM items WHERE id = ?`,
    [item_id]
  );
  if (!item) throw new Error('Item not found');

  const [[existing]] = await pool.query(
    `SELECT * FROM bill_items 
     WHERE bill_id = ? AND item_id = ?`,
    [bill_id, item_id]
  );

  if (existing) {
    await pool.query(
      `UPDATE bill_items 
       SET quantity = quantity + ?
       WHERE id = ?`,
      [quantity, existing.id]
    );
  } else {
    await pool.query(
      `INSERT INTO bill_items (bill_id, item_id, quantity, price)
       VALUES (?, ?, ?, ?)`,
      [bill_id, item_id, quantity, item.price]
    );
  }

  await this.updateBillTotal(bill_id);
},
  

  // 👉 Update số lượng
  async updateQuantity(id, action) {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 1. Lấy item
    const [[item]] = await conn.query(
      'SELECT quantity, bill_id FROM bill_items WHERE id = ?',
      [id]
    );

    if (!item) {
      throw new Error('Bill item not found');
    }

    // 2. Check bill open
    const [[bill]] = await conn.query(
      'SELECT status FROM bills WHERE id = ?',
      [item.bill_id]
    );

    if (!bill || bill.status !== 'open') {
      throw new Error('Bill is closed');
    }

    // 3. Xử lý action
    if (action === 'increase') {
      await conn.query(
        'UPDATE bill_items SET quantity = quantity + 1 WHERE id = ?',
        [id]
      );

    } else if (action === 'decrease') {

      if (item.quantity <= 1) {
        // 👉 xoá luôn
        await conn.query(
          'DELETE FROM bill_items WHERE id = ?',
          [id]
        );
      } else {
        // 👉 giảm 1
        await conn.query(
          'UPDATE bill_items SET quantity = quantity - 1 WHERE id = ?',
          [id]
        );
      }

    } else {
      throw new Error('Invalid action');
    }

    // 4. Update total
    const [[result]] = await conn.query(`
      SELECT SUM(quantity * price) AS total
      FROM bill_items
      WHERE bill_id = ?
    `, [item.bill_id]);

    await conn.query(
      'UPDATE bills SET total = ? WHERE id = ?',
      [result.total || 0, item.bill_id]
    );

    await conn.commit();

    return { message: 'Updated successfully' };

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
},

  // 👉 Xoá món
  async delete(id) {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 1. Check tồn tại
    const [[row]] = await conn.query(
      'SELECT bill_id FROM bill_items WHERE id = ?',
      [id]
    );

    if (!row) {
      throw new Error('Bill item not found');
    }

    // 2. Check bill còn open
    const [[bill]] = await conn.query(
      'SELECT status FROM bills WHERE id = ?',
      [row.bill_id]
    );

    if (!bill || bill.status !== 'open') {
      throw new Error('Bill is closed');
    }

    // 3. Xoá item
    await conn.query(
      'DELETE FROM bill_items WHERE id = ?',
      [id]
    );

    // 4. Tính lại total
    const [[result]] = await conn.query(`
      SELECT SUM(quantity * price) AS total
      FROM bill_items
      WHERE bill_id = ?
    `, [row.bill_id]);

    const total = result.total || 0;

    await conn.query(
      'UPDATE bills SET total = ? WHERE id = ?',
      [total, row.bill_id]
    );

    await conn.commit();

    return { message: 'Deleted successfully' };

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
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