const Category = {
  id: "INT AUTO_INCREMENT PRIMARY KEY",
  name: "VARCHAR(255) NOT NULL",
  type: "ENUM('food','drink') NOT NULL",
  created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
  updated_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
};

module.exports = Category;