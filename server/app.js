const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const vacationsRouter = require("./routes/vacations");
require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use("/api/vacations", vacationsRouter);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the vacation API!");
});





const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});