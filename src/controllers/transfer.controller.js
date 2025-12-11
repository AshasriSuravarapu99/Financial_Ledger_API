const TransferService = require("../services/transfer.service");

// Transfer controller
exports.transfer = async (req, res) => {
  try {
    const { source_account_id, destination_account_id, amount, currency, description } = req.body;

    // Call service to perform transfer
    const result = await TransferService.transfer(
      source_account_id,
      destination_account_id,
      amount,
      currency,
      description
    );

    return res.status(201).json(result);

  } catch (err) {
    if (err.message === "INSUFFICIENT_FUNDS") {
      return res.status(422).json({ error: "Insufficient funds" });
    }
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
