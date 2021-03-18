const { fetchTopics, writeTopic } = require('../models/topicsModel');

exports.getTopics = (req, res, next) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  })
  .catch((err) => {
    next(err);
  });
};

exports.postTopic = (req, res, next) => {
  const { description, slug } = req.body;
  writeTopic(description, slug).then(([topic]) => {
    res.status(201).send({topic})
  })
  .catch((err) => {
    next(err);
  });
};