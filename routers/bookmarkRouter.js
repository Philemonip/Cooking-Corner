"use strict";

module.exports = (express) => {
  const router = express.Router();
  const axios = require("axios");
  const { isLoggedIn } = require("./loginRouter");

  // Knex Setup
  const knexConfig = require("../knexfile")["development"];
  const knex = require("knex")(knexConfig);

  const BookmarkService = require("../services/bookmarkService");
  const bookmarkService = new BookmarkService(knex);

  router.route("/").get(isLoggedIn, userFavouriteRecipe);
  router.route("/:recipeId").post(isLoggedIn, bookmarkFavouriteRecipe);
  router.route("/:recipeId").delete(isLoggedIn, deleteFavouriteRecipe);

  function userFavouriteRecipe(req, res) {
    let user = req.user.id;
    console.log("USER", user);
    console.log(req.user, "isthereuser?");
    return bookmarkService
      .getFavouriteRecipe(req.user.id)
      .then((data) => {
        console.log(data);
        let bookmarkArr = data.map((x) => (x = x.recipe_id));
        console.log(bookmarkArr);
        return bookmarkService.favouriteRecipeInfo(bookmarkArr, user);
      })
      .then((bookmarkRecipeArr) => {
        console.log("LIST", bookmarkRecipeArr);
        res.render("bookmark", {
          user: req.user,
          bookmarkRecipeArr: bookmarkRecipeArr,
        });
      })
      .catch((err) => res.status(500).json(err));
  }

  function bookmarkFavouriteRecipe(req, res) {
    console.log("USER", req.user);
    return bookmarkService
      .checkFavouritelist(req.user.id, req.params.recipeId)
      .then((hvData) => {
        console.log("CHECKBOOKMARK", hvData);
        if (hvData) {
          return "";
        } else {
          return bookmarkService.addFavouriteRecipe(
            req.user.id,
            req.params.recipeId
          );
        }
      })
      .then(() => res.send("bookmark item added"))
      .catch((err) => {
        console.log(err);
      });
  }

  function deleteFavouriteRecipe(req, res) {
    console.log(req.params);
    console.log("USER", req.user);
    return bookmarkService
      .removeFavouriteRecipe(req.user.id, req.params.recipeId)
      .then(() => {
        res.send("bookmark item deleted");
      })
      .catch((err) => res.status(500).json(err));
  }

  return router;
};
