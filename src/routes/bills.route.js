const express = require('express');
const router = express.Router();
const BillController = require('../controllers/bills.controller');

router.get('/', BillController.getAll);
router.get('/:id', BillController.getById);
router.post('/', BillController.create);
router.put('/:id', BillController.update);
router.delete('/:id', BillController.delete);

module.exports = router;