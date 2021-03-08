const {
  topicData,
  articleData,
  commentData,
  userData,
} = require('../data/index.js');



exports.seed = function (knex) {
  // add seeding functionality here
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex.insert(topicData)
      .into("topics")
      .returning("*")

    })
    .then(topicRows => {
      console.log(topicRows)
    })
};
