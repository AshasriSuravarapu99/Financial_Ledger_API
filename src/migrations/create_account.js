exports.up = function (knex) {
  return knex.schema.createTable("accounts", (table) => {
    table.uuid("id").primary();
    table.uuid("user_id").notNullable();
    table.string("account_type").notNullable();
    table.string("currency", 3).notNullable();
    table.string("status").defaultTo("active");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("accounts");
};
