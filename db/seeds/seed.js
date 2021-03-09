const {
  topicData,
  articleData,
  commentData,
  userData,
} = require("../data/index.js");

const { changeTimeStamp,  createRefObj, switchKeyRef } = require("../utils/data-manipulation");

exports.seed = function (knex) {
  // add seeding functionality here
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex.insert(topicData).into("topics").returning("*");
    })
    .then(() => {
      return knex.insert(userData).into("users").returning("*");
    })
    .then(() => {
      const formattedArticles = changeTimeStamp(articleData, "created_at");
      return knex.insert(formattedArticles).into("articles").returning("*");
    })
    .then((insertedArticles) => {
       const articleRef = createRefObj(insertedArticles, "title", "article_id");
       const userRef = createRefObj(commentData, "created_by", "created_by")
       let formattedComments = switchKeyRef(commentData, articleRef, "belongs_to", "article_id");
       formattedComments = switchKeyRef(formattedComments, userRef, "created_by", "author");
       formattedComments = changeTimeStamp(formattedComments, "created_at");
       return knex.insert(formattedComments).into("comments").returning("*");
    });
};
