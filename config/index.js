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
  authJwtSecret: process.env.AUTH_JWT_SECRET,
  defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD,
  defaultUserPassword: process.env.DEFAULT_USER_PASSWORD,
  publicApiKeyToken: process.env.PUBLIC_API_KEY_TOKEN,
  adminApiKeyToken: process.env.ADMIN_API_KEY_TOKEN,
};

module.exports = { config };
