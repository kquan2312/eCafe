const express = require("express");
const router = express.Router();
const TableController = require("../controllers/table.controller");

router.get("/", TableController.getAll);                   // Lấy tất cả bàn
router.post("/", TableController.create);                  // Tạo bàn mới
router.patch("/:id/status", TableController.updateStatus); // Cập nhật trạng thái bàn
router.delete("/:id", TableController.delete);            // Xóa bàn

module.exports = router;