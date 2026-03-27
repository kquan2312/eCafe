// chỉ khai báo các trường
const Table = {
  id: "INT AUTO_INCREMENT PRIMARY KEY",
  name: "VARCHAR(255) NOT NULL",
  status: "ENUM('empty','occupied') DEFAULT 'empty'",
  created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
  updated_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
};

module.exports = Table;