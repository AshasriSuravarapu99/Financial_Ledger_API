const db = require("../config/db");

module.exports = {
  create(data) {
    return db("accounts").insert(data);
  },

  findById(id) {
    return db("accounts").where({ id }).first();
  },

  findLedger(accountId) {
    return db("ledger_entries")
      .where({ account_id: accountId })
      .orderBy("created_at", "desc");
  }
};
