const express = require('express');
const router = express.Router();
const BillController = require('../controllers/bills.controller');

router.get('/', BillController.getAll);// lấy tất cả bill
router.get('/:id', BillController.getById);// lấy bill theo id
router.post('/', BillController.create);// tạo bill mới
router.put('/:id', BillController.update);// cập nhật bill(thủ công, ít dùng, dùng khi cần chỉnh sửa trực tiếp-admin)
router.delete('/:id', BillController.delete);// xóa bill
router.post('/:id/checkout', BillController.checkout);// checkout bill( thanh toán và cập nhật trạng thái bill + bàn)

module.exports = router;