const { dbConnection } = require('../db/dbConnection');

exports.totalArticleNumber = ({ author = null, topic = null }) => {
  let query = dbConnection
  .count("articles.article_id")
  .from("articles");

  if (author != null) {
    query = query.where("articles.author", author);
  };
  if (topic != null) {
    query = query.where("articles.topic", topic);
  };

  return query;
}
exports.fetchArticles = ({ sort_by, order, author = null, topic = null, limit = 10, p = 1}) => {
  let query = dbConnection
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
  .leftJoin("comments", "articles.article_id", "=", "comments.article_id");

  if (author != null) {
    query = query.where("articles.author", author);
  };
  if (topic != null) {
    query = query.where("articles.topic", topic);
  };

  return query
    .groupBy("articles.article_id")
    .orderBy(sort_by || "created_at", order || 'desc')
    .offset((p - 1) * limit)
    .limit(limit)
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
  .then(([article]) => {
    if (!article) {
      return Promise.reject({ status: 404, msg: 'Article not found' });
    };
    return article;
  });
};

exports.updateArticleById = (article_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "Bad request - inc_votes required"})
  };
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

exports.removeArticleById = (article_id) => {
  return dbConnection("articles").where("article_id", article_id).del();
};

exports.writeArticle = (title, topic, author, body) => {
  const article = {
    title,
    topic,
    author,
    body
  };
  return dbConnection("articles")
  .insert(article)
  .returning("*");
};