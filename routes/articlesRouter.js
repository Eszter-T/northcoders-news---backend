const articlesRouter = require('express').Router();
const { getArticleById, getArticles, patchArticleById } = require('../controllers/articleController');
const { postCommentByArticleId } = require('../controllers/commentController');

articlesRouter.route('/').get(getArticles);
articlesRouter.route('/:article_id').get(getArticleById).patch(patchArticleById);
articlesRouter.route('/:article_id/comments').post(postCommentByArticleId);

module.exports = articlesRouter;