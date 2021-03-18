const { fetchArticleById, fetchArticles, updateArticleById, removeArticleById, writeArticle } = require('../models/articleModel');
const { writeCommentByArticleId } = require('../models/commentModel');

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

exports.postArticle = (req, res, next) => {
  const { title, topic, author, body } = req.body;
  writeArticle(title, topic, author, body).then(([article]) => {
    res.status(201).send({article});
  })
  .catch((err) => {
    next(err);
  });
};