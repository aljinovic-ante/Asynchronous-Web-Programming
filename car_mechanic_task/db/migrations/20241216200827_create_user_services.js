/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("user_services", (table) => {
    table
      .integer("userid")
      .unsigned()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    table
      .integer("serviceid")
      .unsigned()
      .references("id")
      .inTable("services")
      .onDelete("CASCADE");
    table.primary(["userid", "serviceid"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("user_services");
};
