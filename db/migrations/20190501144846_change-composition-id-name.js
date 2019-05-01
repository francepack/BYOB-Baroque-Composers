
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('compositions', function(table) {
      table.renameColumn('composers_id', 'composer_id')
    })
  ])

};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('compositions', function(table) {
      table.renameColumn('composer_id', 'composers_id')
    })
  ])
};
