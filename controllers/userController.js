const { fetchUserByUsername, writeUser, fetchUsers } = require('../models/userModel');

exports.getUserByUsername = (req, res, next) => {
    const { username } = req.params;
    fetchUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
        next(err);
    });
};

exports.postUser = (req, res, next) => {
  const { username, name, avatar_url } = req.body;
  writeUser(username, name, avatar_url).then(([user]) => {
    res.status(201).send({user});
  })
  .catch((err) => {
    next(err);
  });
};

exports.getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users });
  })
  .catch((err) => {
    next(err);
  });
};