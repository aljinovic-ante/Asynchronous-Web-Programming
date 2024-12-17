exports.up = function(knex) {
    return knex.schema.createTable('resource_locks', function(table) {
      table.increments('id').primary();
      table.string('resource_type', 255).notNullable();
      table.integer('resource_id').unsigned().notNullable();
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('resource_locks');
  };
  