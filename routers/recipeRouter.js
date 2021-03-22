"use strict";
module.exports = (express) => {
  console.log("router running");
  const router = express.Router();
  const axios = require("axios");

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

  const RecipeService = require("../services/recipeService");
  const recipeService = new RecipeService(knex);

  router.route("/:recipeId").get(getRecipeData);

  function getRecipeData(req, res) {
    let apiData;
    return axios
      .get(
        `https://api.spoonacular.com/recipes/${req.params.recipeId}/information?&apiKey=ba5aba2ccf0049008995c74dfc10d62a`
      )
      .then((info) => {
        apiData = info.data;
        //Check if recipe already in database, insert to DB if not
        return recipeService.checkdata(apiData.id);
      })
      .then((boolean) => {
        if (!boolean) {
          return recipeService.insert(apiData);
        } else {
          return;
        }
      })
      .then(() => {
        //Send data to res.render
        return apiData;
      })
      .catch((err) => {
        console.log("axios get err", err);
      });
  }

  return router;
};
