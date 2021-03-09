const {
  topicData,
  articleData,
  commentData,
  userData,
} = require("../data/index.js");

const { changeTimeStamp } = require("../utils/data-manipulation");

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
    .then((formattedArticles) => {
      console.log(formattedArticles);
    });
};
