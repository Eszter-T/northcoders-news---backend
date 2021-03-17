const { dbConnection } = require('../db/dbConnection');

exports.fetchUser = (username) => {
  return dbConnection
  .select("*")
  .from("users")
  .where("username", username)
  .then(([user]) => {
    if (!user) {
      return Promise.reject({ status: 404, msg: 'User not found' });
    };
    return user;
  });
};