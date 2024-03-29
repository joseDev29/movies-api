const express = require("express");
const passport = require("passport");
const boom = require("@hapi/boom");
const jwt = require("jsonwebtoken");
const ApiKeysService = require("../services/apiKeys");

const { config } = require("../config");
const UserService = require("../services/users");
const { validationHandler } = require("../utils/middleware/validationHandler");
const {
  createUserSchema,
  createProviderUserSchema,
} = require("../utils/schemas/users");

require("../utils/auth/strategies/basic");

function authApi(app) {
  const router = express.Router();
  app.use("/api/auth", router);

  const apiKeysService = new ApiKeysService();
  const userService = new UserService();

  router.post("/sign-in", async (req, res, next) => {
    const { apiKeyToken } = req.body;

    if (!apiKeyToken) {
      next(boom.unauthorized("apiKeyTpken is required"));
    }

    passport.authenticate("basic", (err, user) => {
      try {
        if (err || !user) {
          next(boom.unauthorized());
        }

        req.login(user, { session: false }, async (err) => {
          if (err) {
            next(err);
          }
          const apiKey = await apiKeysService.getApiKey({ token: apiKeyToken });

          if (!apiKey) {
            next(boom.unauthorized());
          }

          const { _id: id, name, email } = user;

          const payload = {
            sub: id,
            name,
            email,
            scopes: apiKey.scopes,
          };

          const token = jwt.sign(payload, config.authJwtSecret, {
            expiresIn: "15m",
          });

          return res.status(200).json({ token, user: { id, name, email } });
        });
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  });

  router.post(
    "/sign-up",
    validationHandler(createUserSchema),
    async (req, res, next) => {
      const { body: user } = req;

      try {
        const createUserId = await userService.createUser({ user });
        res.status(201).json({
          data: createUserId,
          mesaage: "user created",
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.post(
    "/sign-provider",
    validationHandler(createProviderUserSchema),
    async (req, res, next) => {
      const { body } = req;
      const { apiKeyToken, ...user } = body;

      if (!apiKeyToken) {
        next(boom.unauthorized("apiKeyToken is required"));
      }

      try {
        const querieUser = await userService.getOrCreateUser({ user });
        const apiKey = await apiKeysService.getApiKey({ token: apiKeyToken });

        if (!apiKeyToken) {
          next(boom.unauthorized());
        }

        const { _id: id, name, email } = querieUser;

        const payload = {
          sub: id,
          name,
          email,
          scopes: apiKey.scopes,
        };

        const token = jwt.sign(payload, config.authJwtSecret, {
          expiresIn: "15m",
        });

        return res.status(200).json({ token, user: { id, name, email } });
      } catch (error) {
        next(error);
      }
    }
  );
}

module.exports = authApi;
