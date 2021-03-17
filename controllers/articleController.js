const { fetchArticleById, fetchArticles, updateArticleById, removeArticleById } = require('../models/articleModel');

exports.getArticles = (req, res, next) => {
  fetchArticles(req.query).then((articles) => {
      res.status(200).send({ articles });
  })
  .catch((err) => {
    next(err);
  });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params
  fetchArticleById(article_id).then((article) => {
    res.status(200).send({ article });
  })
  .catch((err) => {
    next(err);
  });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes }  = req.body;
  updateArticleById(article_id, inc_votes )
  .then(() => {
    exports.getArticleById(req, res, next)
  })
  .catch((err) => {
    next(err);
  });
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  removeArticleById(article_id).then(() => {
    res.sendStatus(204);
  })
  .catch((err) => {
    next(err);
  });
};