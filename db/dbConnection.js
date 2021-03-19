const ENV = process.env.NODE_ENV || 'development';
const dbConnection = require('knex');

const dbConfig =
  ENV === 'production'
    ? {
        client: 'pg',
        connection: {
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false,
            },
        },
      }
    : require('../knexfile');

module.exports = { dbConnection: dbConnection(dbConfig) }