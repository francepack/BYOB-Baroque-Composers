
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('composers', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('nationality');
      table.string('lifespan');


      table.timestamps(true, true);
    }),

    knex.schema.createTable('compositions', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('arrangedFor');
      table.integer('composers_id').unsigned()
      table.foreign('composers_id')
        .references('composers.id');

      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('composers'),
    knex.schema.dropTable('compositions')
  ]);
};
