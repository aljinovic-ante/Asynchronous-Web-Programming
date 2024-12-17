exports.up = function(knex) {
    return knex.schema
      .createTable('authors', function(table) {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
      })
      .createTable('songs', function(table) {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
      })
      .createTable('authors_songs', function(table) {
        table.increments('id').primary();
        table.integer('author_id').unsigned().references('id').inTable('authors').onDelete('CASCADE');
        table.integer('song_id').unsigned().references('id').inTable('songs').onDelete('CASCADE');
        table.timestamp('created_at').defaultTo(knex.fn.now());
      });
  };
  
  exports.down = function(knex) {
    return knex.schema
      .dropTableIfExists('authors_songs')
      .dropTableIfExists('songs')
      .dropTableIfExists('authors');
  };
  