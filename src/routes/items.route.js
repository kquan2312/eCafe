const express = require('express');
const router = express.Router();
const ItemController = require('../controllers/items.controller');

router.get('/', ItemController.getAll);// lấy tất cả item-món ăn trong menu
router.get('/:id', ItemController.getById);// lấy item theo id
router.post('/', ItemController.create);// tạo item mới
router.put('/:id', ItemController.update);// sửa item
router.delete('/:id', ItemController.delete);// xóa item

module.exports = router;