const { writeCommentByArticleId } = require('../models/commentModel');
const { fetchArticleById } = require("../models/articleModel");

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