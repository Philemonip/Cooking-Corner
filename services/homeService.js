require("dotenv").config();
const knex = require("knex")({
  client: "postgresql",
  connection: {
    database: "recipe",
    user: "philemon",
    password: "philemon",
  },
});

const axios = require("axios");

class HomeService {
  constructor(knex) {
    this.knex = knex;
  }

  getTopRecipes() {
    return this.knex("recipes")
      .whereNotNull("rating")
      .orderBy("rating", "desc")
      .limit(8)
      .then((row) => {
        // console.log(row);
        return row;
      });
  }
}

module.exports = HomeService;
