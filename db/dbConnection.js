const dbConnection = require('knex');
const dbConfig = require('../knexfile');

module.exports = { dbConnection: dbConnection(dbConfig) }