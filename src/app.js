const express = require("express");
const app = express();
const errorHandler = require("./middlewares/errorHandler");

app.use(express.json());

// Routes
app.use("/accounts", require("./routes/account.routes"));
app.use("/transfers", require("./routes/transfer.routes"));
app.use("/deposits", require("./routes/deposit.routes"));
app.use("/withdrawals", require("./routes/withdraw.routes"));
app.use("/transactions", require("./routes/transactionList.routes"));
app.use("/transactions", require("./routes/transaction.routes"));

app.get("/health", (req, res) =>
  res.json({ status: "ok", time: new Date().toISOString() })
);

app.use(errorHandler);

module.exports = app;
