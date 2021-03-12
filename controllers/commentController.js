const { writeCommentByArticleId, fetchCommentsByArticleId } = require('../models/commentModel');
const { fetchArticleById, checkArticleExists } = require("../models/articleModel");


exports.postCommentByArticleId = (req, res, next) => {
    const { username, body } = req.body;
    const { article_id } = req.params;
    
  fetchArticleById(article_id)
    .then(articles => {
        if(articles.length == 0) {
            return res.status(404).send({msg: 'Article not found'});
        };

        return writeCommentByArticleId(username, body, article_id)
            .then((comment) => {
                res.status(201).send({ comment });
            });
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