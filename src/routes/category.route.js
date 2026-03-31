const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categories.controller');

router.get('/', CategoryController.getAll);// lấy tất cả category-danh mục
router.get('/:id', CategoryController.getById);// lấy category theo id
router.post('/', CategoryController.create);// tạo category mới
router.put('/:id', CategoryController.update);//sửa category
router.delete('/:id', CategoryController.delete);// xóa category

module.exports = router;