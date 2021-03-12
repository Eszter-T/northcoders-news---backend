const { fetchArticleById, fetchArticles, updateArticleById } = require('../models/articleModel');

exports.getArticles = (req, res, next) => {
  fetchArticles(req.query).then((articles) => {
      res.status(200).send({ articles });
  });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params
  fetchArticleById(article_id).then((article) => {
    if(!article.length) {
      return res.status(404).send({msg: 'Article not found'});
    };
    res.status(200).send({ article });
  });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes }  = req.body;
  updateArticleById(article_id, inc_votes )
  .then(() => {
    exports.getArticleById(req, res, next)
  });
};