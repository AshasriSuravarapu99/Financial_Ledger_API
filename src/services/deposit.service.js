// src/services/deposit.service.js
const db = require("../config/db");
const { v4: uuid } = require("uuid");

exports.deposit = async (accountId, amount, currency, description = "") => {
  return await db.transaction(async trx => {
    // ensure account exists
    const account = await trx("accounts").where({ id: accountId }).first();
    if (!account) throw { status: 404, message: "Account not found" };

    if (amount <= 0) throw { status: 422, message: "Amount must be > 0" };

    const txId = uuid();
    await trx("transactions").insert({
      id: txId,
      type: "deposit",
      amount,
      currency: currency || account.currency,
      source_account_id: null,
      destination_account_id: accountId,
      status: "completed",
      description
    });

    await trx("ledger_entries").insert({
      id: uuid(),
      account_id: accountId,
      transaction_id: txId,
      entry_type: "credit",
      amount
    });

    return { transaction_id: txId };
  });
};
