const { fetchUser } = require('../models/userModel');

exports.getUser = (req, res, next) => {
    const { username } = req.params;
    fetchUser(username)
    .then((user) => {
      if(user.length == 0) {
        return res.status(404).send({msg: 'User not found'})
      };
      res.status(200).send({ user });
    })
    .catch((err) => {
        console.log(err);
        next(err);
    });
};