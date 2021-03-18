const { dbConnection } = require('../db/dbConnection');

exports.writeCommentByArticleId = (username, body, article_id) => {
  const comment = {
        body,
        article_id,
        author: username,
  }
  return dbConnection("comments")
  .insert(comment)
  .returning("*")
};


exports.fetchCommentsByArticleId = (article_id, { sort_by, order, limit = 10, p = 1}) => {
  return dbConnection
  .select(
    "comment_id",
    "author",
    "article_id",
    "votes",
    "created_at",
    "body"
  )
  .from("comments")
  .where("article_id", article_id)
  .orderBy(sort_by || "created_at", order || "desc")
  .offset((p - 1) * limit)
  .limit(limit);
};

exports.updateCommentById = (comment_id, inc_votes) => {
  return dbConnection
  .from("comments")
  .where("comment_id", comment_id)
  .increment("votes", inc_votes)
};

exports.fetchCommentById = (comment_id) => {
  return dbConnection
  .select(
    "comment_id",
    "author",
    "article_id",
    "votes",
    "created_at",
    "body"
  )
  .from("comments")
  .where("comment_id", comment_id)
};

exports.removeCommentById = (comment_id) => {
  return dbConnection("comments").where("comment_id", comment_id).del();

};