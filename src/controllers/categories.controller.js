const CategoryService = require('../services/categories.service');

const CategoryController = {
  async getAll(req, res) {
    const data = await CategoryService.getAll();
    res.json(data);
  },

  async getById(req, res) {
    const { id } = req.params;
    const data = await CategoryService.getById(id);

    if (!data) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.json(data);
  },

  async create(req, res) {
    const data = await CategoryService.create(req.body);
    res.status(201).json(data);
  },

  async update(req, res) {
    const { id } = req.params;
    const data = await CategoryService.update(id, req.body);
    res.json(data);
  },

  async delete(req, res) {
    const { id } = req.params;
    const data = await CategoryService.delete(id);
    res.json(data);
  }
};

module.exports = CategoryController;