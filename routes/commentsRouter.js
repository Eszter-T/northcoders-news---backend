const commentsRouter = require('express').Router();
const { patchCommentById } = require('../controllers/commentController');
const { handle405s } = require('../errors');

commentsRouter.route('/:comment_id').patch(patchCommentById).all(handle405s);

module.exports = commentsRouter;