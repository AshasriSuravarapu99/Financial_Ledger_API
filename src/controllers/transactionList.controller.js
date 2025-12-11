const db = require("../config/db");

exports.listTransactions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const offset = parseInt(req.query.offset, 10) || 0;

    // Optional filters
    const { type, account_id } = req.query;

    let query = db("transactions").orderBy("created_at", "desc");

    if (type) {
      query = query.where({ type });
    }

    if (account_id) {
      query = query.where(builder => {
        builder.where("source_account_id", account_id)
               .orWhere("destination_account_id", account_id);
      });
    }

    const rows = await query.limit(limit).offset(offset);

    // Get total count for pagination
    let countQuery = db("transactions");
    if (type) countQuery = countQuery.where({ type });
    if (account_id) {
      countQuery = countQuery.where(builder => {
        builder.where("source_account_id", account_id)
               .orWhere("destination_account_id", account_id);
      });
    }

    const [{ total }] = await countQuery.count({ total: "*" });

    res.json({
      limit,
      offset,
      total: Number(total),
      transactions: rows
    });

  } catch (err) {
    console.error("List transactions error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
