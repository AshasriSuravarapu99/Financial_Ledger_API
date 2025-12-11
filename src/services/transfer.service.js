const db = require("../config/db");
const { v4: uuid } = require("uuid");

module.exports = {
  async transfer(sourceId, destId, amount, currency, description) {
    return await db.transaction(async trx => {
      
      // Calculate balance
      const credit = await trx("ledger_entries")
        .where({ account_id: sourceId, entry_type: "credit" })
        .sum("amount as total");

      const debit = await trx("ledger_entries")
        .where({ account_id: sourceId, entry_type: "debit" })
        .sum("amount as total");

      const balance = (credit[0].total || 0) - (debit[0].total || 0);

      if (balance < amount) {
        throw new Error("INSUFFICIENT_FUNDS");
      }

      // Create transaction record
      const txId = uuid();
      await trx("transactions").insert({
        id: txId,
        type: "transfer",
        amount,
        currency,
        source_account_id: sourceId,
        destination_account_id: destId,
        description,
        status: "completed"
      });

      // Ledger entries
      await trx("ledger_entries").insert([
        {
          id: uuid(),
          account_id: sourceId,
          transaction_id: txId,
          entry_type: "debit",
          amount
        },
        {
          id: uuid(),
          account_id: destId,
          transaction_id: txId,
          entry_type: "credit",
          amount
        }
      ]);

      return { transaction_id: txId };
    });
  }
};
