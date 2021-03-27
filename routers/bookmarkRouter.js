"use strict";

module.exports = (express) => {
  const router = express.Router();
  const axios = require("axios");
  const { isLoggedIn } = require("./loginRouter");

  // Knex Setup
  const knexConfig = require("../knexfile")["development"];
  const knex = require("knex")(knexConfig);

  const RecipeService = require("../services/recipeService");
  const recipeService = new RecipeService(knex);
  const BookmarkService = require("../services/bookmarkService");
  const bookmarkService = new BookmarkService(knex);

  router.route("/").get(isLoggedIn, userFavouriteRecipe);
  // router.route("/:abc").post(addWatchItem); //FIXME: isLoggedIn
  router.route("/:recipeId").delete(deleteFavoruiteRecipe);

  function userFavouriteRecipe(req, res) {
    console.log(req.user);
    return bookmarkService
      .getFavouriteRecipe(req.user.id)
      .then((data) => {
        console.log(data);
        let bookmarkArr = data.map((x) => (x = x.recipe_id));
        console.log(bookmarkArr);
        return bookmarkService.favouriteRecipeInfo(bookmarkArr);
      })
      .then((bookmarkRecipeArr) => {
        console.log(bookmarkRecipeArr);
        res.render("bookmark", {
          user: req.user,
          bookmarkRecipeArr: bookmarkRecipeArr,
        });
      })
      .catch((err) => res.status(500).json(err));
  }

  function deleteFavoruiteRecipe(req, res) {
    console.log(req.params);
    console.log("USER", req.user);
    return bookmarkService
      .removeFavouriteRecipe(req.user.id, req.params.recipeId)
      .then(() => {
        res.send("watchlist item deleted");
      })
      .catch((err) => res.status(500).json(err));
  }

  return router;
};
