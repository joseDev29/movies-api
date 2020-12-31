const boom = require("@hapi/boom");

function scopesValidationHandler(allowedScopes) {
  return (req, res, next) => {
    if (!req.user || (req.user && !req.user.scopes)) {
      next(boom.unauthorized("Missiing scopes"));
    }

    const hasAcces = allowedScopes
      .map((allowedScope) => req.user.scopes.includes(allowedScope))
      .find((allowed) => Boolean(allowed));

    if (hasAcces) {
      next();
    } else {
      next(boom.unauthorized("Insufficients scopes"));
    }
  };
}

module.exports = scopesValidationHandler;
