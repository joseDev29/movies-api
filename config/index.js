require("dotenv").config();

const config = {
  //modo de desarrollo, si NODE_ENV se envia como "production", dev seria false
  dev: process.env.NODE_ENV ? false : true,
  port: process.env.PORT || 3000,
  cors: process.env.DB_CORS,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
};

module.exports = { config };
