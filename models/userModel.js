const { dbConnection } = require('../db/dbConnection');

exports.fetchUser = (username) => {
  return dbConnection("users").where("username", username);
};