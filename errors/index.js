exports.handlePsqlErrors = (err, req, res, next) => {
  const psqlBadRequestCodes = ['23502', '22P02'];
  if (psqlBadRequestCodes.includes(err.code)) {
    res.status(400).send({ msg: err.msg || 'Bad request'})
  } else {
    next(err);
  };
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  };
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
};

exports.handle405s = (( req, res, next) => {
  res.status(405).send({ msg: "Method not allowed"});
});