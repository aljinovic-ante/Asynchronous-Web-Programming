/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("services", (table) => {
    table.increments("id").primary();
    table
      .integer("mechanicid")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("carid")
      .unsigned()
      .references("id")
      .inTable("cars")
      .onDelete("CASCADE");
    table.text("description");
    table.string("status").notNullable();
    table.datetime("starttime");
    table.datetime("endtime");
    table.decimal("price", 10, 2).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("services");
};
