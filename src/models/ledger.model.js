const db = require("../config/db");

module.exports = {
  insert(entries) {
    return db("ledger_entries").insert(entries);
  }
};
