/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("cars", (table) => {
    table.increments("id").primary();
    table.string("make").notNullable();
    table.string("model").notNullable();
    table
      .integer("userid")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.integer("manufacturingyear");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("cars");
};
