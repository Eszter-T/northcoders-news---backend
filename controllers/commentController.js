const { writeCommentByArticleId, fetchCommentsByArticleId, updateCommentById, fetchCommentById, removeCommentById } = require('../models/commentModel');
const { fetchArticleById, checkArticleExists } = require("../models/articleModel");


exports.postCommentByArticleId = (req, res, next) => {
    const { username, body } = req.body;
    const { article_id } = req.params;
    
  fetchArticleById(article_id)
    .then(() => writeCommentByArticleId(username, body, article_id)
      .then((comment) => {
        res.status(201).send({ comment });
      })
    )
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([fetchCommentsByArticleId(article_id, req.query), checkArticleExists(article_id)])
    .then(([comments]) => {
        res.status(200).send({ comments });
    })
    .catch(error => { 
        next(error)
    });
};

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentById(comment_id, inc_votes)
  .then(() => {
    fetchCommentById(comment_id).then(([comment]) => {
      res.status(200).send({ comment });
    });
  })
  .catch((err) => {
    console.log(err)
    next(err);
  });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id).then(() => {
    res.sendStatus(204);
  })
  .catch((err) => {
    next(err);
  });
};