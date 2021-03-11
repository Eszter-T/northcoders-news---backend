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