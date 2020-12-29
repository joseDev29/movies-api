const boom = require("@hapi/boom");
const { config } = require("../../config");

function withErrorStack(err, stack) {
  if (config.dev) {
    return { ...err, stack };
  }

  return err;
}

function logError(err, req, res, next) {
  console.error("New Error: ", err.message);
  next(err);
}

function wrapError(err, req, res, next) {
  if (!err.isBoom) {
    next(boom.badImplementation(err));
  }

  next(err);
}

function errorHandler(err, req, res, next) {
  const {
    output: { statusCode, payload },
  } = err;
  res.status(statusCode);
  res.json(withErrorStack(payload, err.stack));
}

module.exports = {
  logError,
  wrapError,
  errorHandler,
};
