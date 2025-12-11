// src/controllers/deposit.controller.js
const DepositService = require("../services/deposit.service");

exports.createDeposit = async (req, res) => {
  try {
    const { account_id, amount, currency, description } = req.body;
    const result = await DepositService.deposit(account_id, Number(amount), currency, description);
    res.status(201).json(result);
  } catch (err) {
    if (err && err.status) return res.status(err.status).json({ error: err.message });
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
