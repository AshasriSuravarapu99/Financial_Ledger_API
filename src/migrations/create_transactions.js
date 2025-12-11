exports.up = function (knex) {
  return knex.schema.createTable("transactions", (table) => {
    table.uuid("id").primary();
    table.string("type").notNullable();
    table.decimal("amount", 30, 8).notNullable();
    table.string("currency", 3).notNullable();
    table.uuid("source_account_id");
    table.uuid("destination_account_id");
    table.string("status").defaultTo("pending");
    table.text("description");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("transactions");
};
