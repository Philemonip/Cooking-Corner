"use strict";

module.exports = (express) => {
  const router = express.Router();
  const axios = require("axios");

  //   router.route("/").get(getSearch);
  //   router.route("/:cuisine").get(getSearchQuery);

  // Knex Setup
  require("dotenv").config();
  const knex = require("knex")({
    client: "postgresql",
    connection: {
      database: process.env.DATABASE,
      user: process.env.USERNAME,
      password: process.env.PASSWORD,
    },
  });
};
