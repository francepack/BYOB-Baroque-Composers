module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/baroque',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true 
  }
};