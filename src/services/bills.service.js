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
  },
  // Checkout: tính tổng, cập nhật bill + bàn
 async checkout(bill_id) {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 1. Check bill
    const [[bill]] = await conn.query(
      'SELECT * FROM bills WHERE id = ? AND status = "open"',
      [bill_id]
    );

    if (!bill) {
      throw new Error('Bill not found or already closed');
    }

    // 2. Lấy danh sách món + subtotal
    const [items] = await conn.query(`
      SELECT 
        bi.id,
        bi.quantity,
        bi.price,
        (bi.quantity * bi.price) AS subtotal,
        i.name
      FROM bill_items bi
      LEFT JOIN items i ON i.id = bi.item_id
      WHERE bi.bill_id = ?
    `, [bill_id]);

    // 3. Tính total từ items
    // const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const total = items.reduce(
  (sum, item) => sum + Number(item.subtotal),
  0
);
const totalFormatted = total.toLocaleString('vi-VN') + ' vnđ';
    // 4. Update bill
    await conn.query(
      `UPDATE bills 
       SET total = ?, status = 'closed' 
       WHERE id = ?`,
      [total, bill_id]
    );

    // 5. Update table
    await conn.query(
      `UPDATE tables 
       SET status = 'empty' 
       WHERE id = ?`,
      [bill.table_id]
    );

    await conn.commit();

    return {
      message: 'Checkout success',
      bill_id: bill.id,
      table_id: bill.table_id,
      created_at: bill.created_at,
      items,
      total: totalFormatted
    };

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
};

module.exports = BillService;   