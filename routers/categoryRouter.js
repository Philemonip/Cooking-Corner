// "use strict";

// module.exports = (express) => {
//   const router = express.Router();
//   const axios = require("axios");

//   //   router.route("/").get(getSearch);
//   //   router.route("/:cuisine").get(getSearchQuery);

//   // Knex Setup
//   require("dotenv").config();
//   const knex = require("knex")({
//     client: "postgresql",
//     connection: {
//       database: process.env.DATABASE,
//       user: process.env.USERNAME,
//       password: process.env.PASSWORD,
//     },
//   });
// };

const express = require("express");

class recipeRouter {
  constructor(recipeService, ingredientService, reviewService) {
    this.recipeService = recipeService;
    this.ingredientService = ingredientService;
    this.reviewService = reviewService;
  }

  router() {
    let router = express.Router();
    // router.get("/api/users", this.getAllRecipe.bind(this));
    router.get("/:id", this.fetchRecipe.bind(this));
    // router.post("/insert", this.postRecipe.bind(this));

    // router.put("/api/users/:id", this.editUser.bind(this));
    // router.delete("/api/users/:id", this.deleteUser.bind(this));
    return router;
  }
}