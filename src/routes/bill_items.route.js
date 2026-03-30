
const express = require('express');
const router = express.Router();
const BillItemController = require('../controllers/bill_items.controller');

router.get('/:bill_id', BillItemController.getByBill);
router.post('/', BillItemController.addItem); // gọi món
router.put('/:id', BillItemController.updateQuantity);

router.post('/:id/increase', BillItemController.updateQuantity); // tăng số lượng
router.post('/:id/decrease', BillItemController.updateQuantity); // giảm số lượng

module.exports = router;