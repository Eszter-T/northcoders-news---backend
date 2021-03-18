const usersRouter = require('express').Router();
const { getUserByUsername, postUser, getUsers } = require('../controllers/userController');
const { handle405s } = require('../errors');

usersRouter.route('/:username').get(getUserByUsername).all(handle405s);
usersRouter.route('/').get(getUsers).post(postUser).all(handle405s);

module.exports = usersRouter;