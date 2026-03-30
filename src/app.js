const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 log middleware
const logger = require("./utils/logger");
app.use(logger);

// Table route
const tableRoute = require("./routes/table.route");
app.use("/tables", tableRoute);

// Category route
const categoryRoute = require("./routes/category.route")
app.use("/category",categoryRoute)

// items router
const itemRouter = require('./routes/items.route');
app.use('/items', itemRouter);

//bill router
const billRouter = require('./routes/bills.route');
app.use('/bills', billRouter);

//bill_items route
const billItemRouter = require('./routes/bill_items.route');
app.use('/bill-items', billItemRouter);

app.get("/", (req, res) => res.send("E-Cafe API running 🚀"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));