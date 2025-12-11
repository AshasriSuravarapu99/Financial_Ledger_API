const db = require("../config/db");

exports.getTransactionById = async (req, res) => {
  try {
    const txId = req.params.id;

    const transaction = await db("transactions")
      .where({ id: txId })
      .first();

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const entries = await db("ledger_entries")
      .where({ transaction_id: txId })
      .orderBy("created_at", "asc");

    res.json({
      transaction,
      ledger_entries: entries
    });

  } catch (err) {
    console.error("Transaction detail error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
