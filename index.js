const express = require("express");

const { config } = require("./config/index");

const app = express();

const {
  logError,
  errorHandler,
  wrapError,
} = require("./utils/middleware/errorHandlers");

const { notFoundHandler } = require("./utils/middleware/notFoundHandler");

const moviesAPI = require("./routes/movies");
const userMoviesApi = require("./routes/userMovies");

//body parser
app.use(express.json());

moviesAPI(app);
userMoviesApi(app);
//catch 404
app.use(notFoundHandler);
//Los middleware de error siempre deben ir despues de las rutas
app.use(logError);
app.use(wrapError);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Listening http://localhost:${config.port}`);
});
