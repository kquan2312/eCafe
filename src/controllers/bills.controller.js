const BillService = require('../services/bills.service');

const BillController = {
  async getAll(req, res) {
    const data = await BillService.getAll();
    res.json(data);
  },

  async getById(req, res) {
    const { id } = req.params;
    const data = await BillService.getById(id);

    if (!data) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.json(data);
  },

  async create(req, res) {
    const data = await BillService.create(req.body);
    res.status(201).json(data);
  },

  async update(req, res) {
    const { id } = req.params;
    const data = await BillService.update(id, req.body);
    res.json(data);
  },

  async delete(req, res) {
    const { id } = req.params;
    const data = await BillService.delete(id);
    res.json(data);
  }
};

module.exports = BillController;