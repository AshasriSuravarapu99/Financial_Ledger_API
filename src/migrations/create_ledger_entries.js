exports.up = function (knex) {
  return knex.schema.createTable("ledger_entries", (table) => {
    table.uuid("id").primary();
    table.uuid("account_id").notNullable();
    table.uuid("transaction_id").notNullable();
    table.enu("entry_type", ["debit", "credit"]).notNullable();
    table.decimal("amount", 30, 8).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("ledger_entries");
};
