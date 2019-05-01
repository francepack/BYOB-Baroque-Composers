exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('compositions', function(table) {
      table.string('composers_id');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('compositions', function(table) {
      table.dropColumn('composers_id');
    })
  ]);
};
