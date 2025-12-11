const db = require("../config/db");

module.exports = {
  create(data) {
    return db("transactions").insert(data);
  }
};
