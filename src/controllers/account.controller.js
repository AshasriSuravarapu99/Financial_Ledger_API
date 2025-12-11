const db = require("../config/db");
const Account = require("../models/account.model");
const { v4: uuid } = require("uuid");

// Create account
exports.createAccount = async (req, res) => {
  const { user_id, account_type, currency } = req.body;
  const id = uuid();
  await Account.create({ id, user_id, account_type, currency });
  res.status(201).json({ id });
};

// Get account with balance
exports.getAccountWithBalance = async (req, res) => {
  const { id } = req.params;

  const account = await Account.findById(id);
  if (!account) return res.status(404).json({ error: "Account not found" });

  const credit = await db("ledger_entries")
    .where({ account_id: id, entry_type: "credit" })
    .sum("amount as total");

  const debit = await db("ledger_entries")
    .where({ account_id: id, entry_type: "debit" })
    .sum("amount as total");

  const balance = (credit[0].total || 0) - (debit[0].total || 0);

  res.json({ account, balance });
};

// Get ledger entries
exports.getLedger = async (req, res) => {
  try {
    const accountId = req.params.id;
    const limit = parseInt(req.query.limit, 10) || 50;
    const offset = parseInt(req.query.offset, 10) || 0;

    const account = await db("accounts").where({ id: accountId }).first();
    if (!account) return res.status(404).json({ error: "Account not found" });

    const rows = await db("ledger_entries")
      .where({ account_id: accountId })
      .orderBy("created_at", "desc")
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db("ledger_entries")
      .where({ account_id: accountId })
      .count({ total: "*" });

    res.json({
      account_id: accountId,
      limit,
      offset,
      total: Number(total),
      entries: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
