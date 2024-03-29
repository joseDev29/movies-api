const express = require("express");
const MoviesService = require("../services/movies");
const {
  movieIdSchema,
  createMovieSchema,
  updateMovieSchema,
} = require("../utils/schemas/movies");

const { validationHandler } = require("../utils/middleware/validationHandler");
const scopesValidationHandler = require("../utils/middleware/scopesValidationHandler");
const cacheResponse = require("../utils/cacheResponse");
const {
  FIVE_MINUTES_IN_SECONDS,
  SIXTY_MINUTES_IN_SECONDS,
} = require("../utils/time");
const passport = require("passport");

//JWT strategy
require("../utils/auth/strategies/jwt");

const moviesAPI = (app) => {
  const router = express.Router();
  app.use("/api/movies", router);

  const moviesService = new MoviesService();

  router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    scopesValidationHandler([`read:movies`]),
    async (req, res, next) => {
      cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
      const { tags } = req.query;
      try {
        const movies = await moviesService.getMovies({ tags });
        res.status(200).json({
          data: movies,
          message: "movies listed",
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.get(
    "/:movieId",
    passport.authenticate("jwt", { session: false }),
    scopesValidationHandler([`read:movies`]),
    validationHandler({ movieId: movieIdSchema }, "params"),
    async (req, res, next) => {
      cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
      const { movieId } = req.params;
      try {
        const movie = await moviesService.getMovie({ movieId });
        res.status(200).json({
          data: movie,
          message: "movie",
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    scopesValidationHandler([`create:movies`]),
    validationHandler(createMovieSchema),
    async (req, res, next) => {
      const { body: movie } = req;
      try {
        const createMovieId = await moviesService.createMovie({ movie });

        res.status(201).json({
          data: createMovieId,
          message: "movies create",
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.put(
    "/:movieId",
    passport.authenticate("jwt", { session: false }),
    scopesValidationHandler([`update:movies`]),
    validationHandler({ movieId: movieIdSchema }, "params"),
    validationHandler(updateMovieSchema),
    async (req, res, next) => {
      const { movieId } = req.params;
      const { body: movie } = req;
      try {
        const updateMovieId = await moviesService.updateMovie({
          movieId,
          movie,
        });

        res.status(200).json({
          data: updateMovieId,
          message: "movie update",
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.delete(
    "/:movieId",
    passport.authenticate("jwt", { session: false }),
    scopesValidationHandler([`delete:movies`]),
    validationHandler({ movieId: movieIdSchema }, "params"),
    async (req, res, next) => {
      const { movieId } = req.params;
      try {
        const deleteMovieId = await moviesService.deleteMovie({ movieId });

        res.status(200).json({
          data: deleteMovieId,
          message: "movie delete",
        });
      } catch (err) {
        next(err);
      }
    }
  );
};

module.exports = moviesAPI;
