const db = require("../config/db");
const { v4: uuid } = require("uuid");

exports.withdraw = async (accountId, amount, currency, description = "") => {
  return await db.transaction(async trx => {

    // Check account exists
    const account = await trx("accounts").where({ id: accountId }).first();
    if (!account) throw { status: 404, message: "Account not found" };

    if (amount <= 0)
      throw { status: 422, message: "Amount must be greater than zero" };

    // Compute balance
    const credit = await trx("ledger_entries")
      .where({ account_id: accountId, entry_type: "credit" })
      .sum("amount as total");

    const debit = await trx("ledger_entries")
      .where({ account_id: accountId, entry_type: "debit" })
      .sum("amount as total");

    const balance = (credit[0].total || 0) - (debit[0].total || 0);

    if (balance < amount)
      throw { status: 422, message: "Insufficient funds" };

    // Insert transaction record
    const txId = uuid();
    await trx("transactions").insert({
      id: txId,
      type: "withdrawal",
      amount,
      currency: currency || account.currency,
      source_account_id: accountId,
      destination_account_id: null,
      status: "completed",
      description
    });

    // Add ledger entry (debit)
    await trx("ledger_entries").insert({
      id: uuid(),
      account_id: accountId,
      transaction_id: txId,
      entry_type: "debit",
      amount
    });

    return { transaction_id: txId };
  });
};
