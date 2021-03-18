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
  .returning("*")
};

exports.checkTopicExists = ({ topic = null}) => {
  if(topic == null) {
    return Promise.resolve();
  }
  return dbConnection
  .select("*")
  .from("topics")
  .where("slug", topic)
  .then(([topic]) => {
    if (topic === undefined) {
      return Promise.reject({ status: 404, msg: "Topic not found"});
    };
  });
};