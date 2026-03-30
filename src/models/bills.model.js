const Bill = {
  tableName: 'bills',
  columns: {
    id: "INT AUTO_INCREMENT PRIMARY KEY",
    table_id: "INT NOT NULL",
    total: "DECIMAL(10,2) DEFAULT 0",
    status: "ENUM('open','closed') DEFAULT 'open'",
    created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    updated_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
  }
};

module.exports = Bill;