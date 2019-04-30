module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/baroque',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true 
  }
};