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

app.get("/", (req, res) => res.send("E-Cafe API running 🚀"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));