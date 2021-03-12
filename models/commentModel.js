const { dbConnection } = require('../db/dbConnection');

exports.writeCommentByArticleId = (username, body, article_id) => {
  const comment = {
        body,
        article_id,
        author: username,
        created_at: new Date()
      }
      console.log(comment)
  return dbConnection("comments")
  .insert(comment)
  .returning("*")
};


exports.fetchCommentsByArticleId = (article_id, { sort_by }) => {
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
  .orderBy(sort_by || "created_at")

};