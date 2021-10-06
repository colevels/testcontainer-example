require("dotenv-safe").config({ allowEmptyValues: false });

module.exports = {
  client: "mysql2",
  version: process.env.MYSQL_VERSION || "8",
  connection: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306,
  },
  migrations: {
    extension: "ts",
    directory: "./migrations",
  },
  debug: process.env.LOG_LEVEL === "debug",
};
