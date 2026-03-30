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
  const { action } = req.body; // action = 'increase' | 'decrease'

  if (!['increase', 'decrease'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action' });
  }

  try {
    await BillItemService.updateQuantity(id, action);
    res.json({ message: 'Updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
},

  async delete(req, res) {
    const { id } = req.params;

    await BillItemService.delete(id);
    res.json({ message: 'Deleted successfully' });
  }
};

module.exports = BillItemController;