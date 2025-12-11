const WithdrawService = require("../services/withdraw.service");

exports.createWithdrawal = async (req, res) => {
  try {
    const { account_id, amount, currency, description } = req.body;

    const result = await WithdrawService.withdraw(
      account_id,
      Number(amount),
      currency,
      description
    );

    res.status(201).json(result);

  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });

    console.error("Withdraw error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
