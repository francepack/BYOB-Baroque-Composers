
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('compositions', function(table) {
      table.string('composer_id');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('compositions', function(table) {
      table.dropColumn('composer_id');
    })
  ]);
};
