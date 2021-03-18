const { dbConnection } = require('../db/dbConnection');

exports.fetchTopics = () => {
  return dbConnection.select("*").from("topics");
  
};

exports.writeTopic = (description, slug) => {
  const topic = {
    description,
    slug
  };
  return dbConnection("topics")
  .insert(topic)
  .returning("*");
};