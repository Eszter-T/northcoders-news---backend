const { dbConnection } = require('../db/dbConnection');

exports.fetchArticles = () => {
  return dbConnection
  .select(
    "articles.article_id",
    "articles.title",
    "articles.topic",
    "articles.author",
    "articles.body",
    "articles.created_at",
    "articles.votes"
  )
  .count("comments.comment_id as comment_count")
  .from("articles")
  .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
  .groupBy("articles.article_id")
  .orderBy("title", "asc")
};

exports.fetchArticleById = (article_id) => {
  return dbConnection
  .select(
    "articles.article_id",
    "articles.title",
    "articles.topic",
    "articles.author",
    "articles.body",
    "articles.created_at",
    "articles.votes"
  )
  .count("comments.comment_id as comment_count")
  .from("articles")
  .where("articles.article_id", article_id)
  .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
  .groupBy("articles.article_id")
  .orderBy("title", "asc")
};

exports.updateArticleById = (article_id, inc_votes) => {
  return dbConnection
  .from("articles")
  .where("article_id", article_id)
  .increment("votes", inc_votes)
};

exports.checkArticleExists = (article_id) => {
  return dbConnection
  .select("*")
  .from("articles")
  .where({ article_id })
  .then(([article]) => {
    if (article === undefined) {
      return Promise.reject({ status: 404, msg: "Article_id not found"});
    };
  
  });

};