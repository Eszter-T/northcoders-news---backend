exports.handle404s = (error, req, res, next) => {
  res.status(404).send({msg: error.msg});
};

exports.handle405s = (( req, res, next) => {
  res.status(405).send({ msg: "Method not allowed"});
});