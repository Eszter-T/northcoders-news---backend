const articlesRouter = require('express').Router();
const { getArticleById, getArticles, patchArticleById, deleteArticleById } = require('../controllers/articleController');
const { postCommentByArticleId, getCommentsByArticleId } = require('../controllers/commentController');
const { handle405s } = require('../errors');

articlesRouter.route('/').get(getArticles).all(handle405s);
articlesRouter.route('/:article_id').get(getArticleById).patch(patchArticleById).delete(deleteArticleById).all(handle405s);
articlesRouter.route('/:article_id/comments').post(postCommentByArticleId).get(getCommentsByArticleId).all(handle405s);

module.exports = articlesRouter;