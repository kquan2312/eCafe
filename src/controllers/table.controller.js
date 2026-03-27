const TableService = require("../services/table.service");

class TableController {
  static async create(req, res) {
    try {
      const { name } = req.body;
      const result = await TableService.createTable(name);
      res.json({ success: true, id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getAll(req, res) {
    try {
      const tables = await TableService.getAllTables();
      res.json(tables);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body; // 'empty' hoặc 'occupied'
      await TableService.updateTableStatus(id, status);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await TableService.deleteTable(id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = TableController;