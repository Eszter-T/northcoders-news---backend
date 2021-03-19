const { dbConnection } = require('../db/dbConnection');

exports.fetchUserByUsername = (username) => {
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

exports.writeUser = (username, name, avatar_url) => {
  const user = {
    username,
    name,
    avatar_url
  };
  return dbConnection("users")
  .insert(user)
  .returning("*");
};

exports.fetchUsers = () => {
  return dbConnection.select("*").from("users");
};

exports.checkAuthorExists = ({ author = null}) => {
  if (author == null) {
    return Promise.resolve();
  };
  return dbConnection
  .select("*")
  .from("users")
  .where("username", author)
  .then(([user]) => {
    if (user === undefined) {
      return Promise.reject({ status: 404, msg: "Author not found"});
    };
  });
};