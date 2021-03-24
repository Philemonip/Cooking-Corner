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

  router
    .route("/:recipeId")
    .get(getReview)
    .post(postReview)
    .put(putReview)
    .delete(deleteReview);

  function getReview(req, res) {
    function getRecipeData() {
      let apiData;
      return axios
        .get(
          `https://api.spoonacular.com/recipes/${req.params.recipeId}/information?&apiKey=ba5aba2ccf0049008995c74dfc10d62a`
        )
        .then((info) => {
          apiData = info.data;
          console.log(apiData);
          return recipeService.checkData(apiData.id);
        })
        .then((boolean) => {
          console.log("yes");
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
      //Check if recipe already in database

      //   apiData = knex
      //     .select(
      //       "recipes.api_id",
      //       "recipes.title",
      //       "recipes.author",
      //       "recipes.summary",
      //       "recipes.instructions",
      //       "recipes.preparation_time",
      //       "recipes.image_path",
      //       "recipes.servings",
      //       "recipes.difficulty",
      //       "recipes_ingredients.ingredient_id",
      //       "recipes_ingredients.quantity",
      //       "recipes_ingredients.unit"
      //     )
      //     .from("recipes")
      //     .innerJoin(
      //       "recipes_ingredients",
      //       "recipes.api_id",
      //       "recipes_ingredients.api_id"
      //     )
      //     .innerJoin(
      //       "recipes_cuisines",
      //       "recipes.api_id",
      //       "recipes_cuisines.api_id"
      //     )
      //     .where("recipes.api_id", req.params.recipeId);
    }
    function getMyReview() {
      return recipeService
        .list(req.params.recipeId, 1) //TODO: replace with real userid
        .then((data) => {
          return data;
        })
        .catch((err) => res.status(500).json(err));
    }

    function getRecipeReview() {
      return recipeService
        .listall(req.params.recipeId, 1) //TODO: replace with real userid
        .then((data) => {
          return data;
        })
        .catch((err) => res.status(500).json(err));
    }

    Promise.all([getRecipeData(), getMyReview(), getRecipeReview()])
      .then(function (results) {
        console.log("hi", results);
        const data = results[0];
        const myReview = results[1];
        const recipeReview = results[2];
        let splitInstructions = data.analyzedInstructions[0].steps
          .map((x) => (x = x.step))
          .join("@@");
        console.log("First split", splitInstructions);

        let finalInstructions = splitInstructions.split("@@");
        console.log("Final split", finalInstructions);

        res.render("recipes", {
          api_id: data.id,
          title: data.title,
          summary: data.summary,
          author: data.sourceName,
          preparation_time: data.readyInMinutes,
          image_path: data.image,
          instructions: finalInstructions,
          servings: data.servings,
          ingredients: data.ingredients,
          myReviewArr: myReview,
          reviewArr: recipeReview,
        });
      })
      .catch((err) => res.status(500).json(err));
  }
  function postReview(req, res) {
    console.log("post review");
    return recipeService
      .add(
        req.params.recipeId,
        1, //TODO: replace with real userid
        req.body.comment,
        req.body.rating
      )
      .then(() => res.redirect("/"))
      .catch((err) => res.status(500).json(err));
  }

  function putReview(req, res) {
    console.log("update review");
    console.log(req.body);
    return recipeService
      .update(
        req.params.recipeId,
        1, //TODO: replace with real userid
        req.body.edit,
        req.body.rating
      )
      .then(() => res.send("put"))
      .catch((err) => res.status(500).json(err));
  }

  function deleteReview(req, res) {
    console.log("delete review");
    return recipeService
      .remove(req.params.recipeId, 1) //TODO: replace with real userid
      .then(() => res.send("delete"))
      .catch((err) => res.status(500).json(err));
  }

  return router;
};
