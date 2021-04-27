function errorHandler(res, err, status = 500) {
  console.log(err);
  return res.status(status).send(err);
}

exports.errorHandler = errorHandler;
