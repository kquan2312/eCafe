const BillItemService = require('../services/bill_items.service');

const BillItemController = {
  async getByBill(req, res) {
    const { bill_id } = req.params;
    const data = await BillItemService.getByBillId(bill_id);
    res.json(data);
  },

  async addItem(req, res) {
    const { bill_id, item_id, quantity } = req.body;

    await BillItemService.addItem(bill_id, item_id, quantity);
    res.json({ message: 'Added successfully' });
  },

  async updateQuantity(req, res) {
    const { id } = req.params;
    const { quantity } = req.body;

    await BillItemService.updateQuantity(id, quantity);
    res.json({ message: 'Updated successfully' });
  },

  async delete(req, res) {
    const { id } = req.params;

    await BillItemService.delete(id);
    res.json({ message: 'Deleted successfully' });
  }
};

module.exports = BillItemController;