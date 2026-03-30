const BillItem = {
  tableName: 'bill_items',
  columns: {
    id: "INT AUTO_INCREMENT PRIMARY KEY",
    bill_id: "INT NOT NULL",
    item_id: "INT NOT NULL",
    quantity: "INT NOT NULL DEFAULT 1",
    price: "DECIMAL(10,2) NOT NULL",
    created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    updated_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
  }
};

module.exports = BillItem;  