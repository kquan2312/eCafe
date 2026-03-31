const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 log middleware
const logger = require("./utils/logger");
app.use(logger);

// Prefix chung cho API
const API_PREFIX = "/api";

// Routes
app.use(`${API_PREFIX}/tables`, require("./routes/table.route"));
app.use(`${API_PREFIX}/category`, require("./routes/category.route"));
app.use(`${API_PREFIX}/items`, require("./routes/items.route"));
app.use(`${API_PREFIX}/bills`, require("./routes/bills.route"));
app.use(`${API_PREFIX}/bill-items`, require("./routes/bill_items.route"));

// Test endpoint
app.get("/", (req, res) => res.send("E-Cafe API running 🚀"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));