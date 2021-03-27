module.exports = class BookmarkService {
  constructor(knex) {
    this.knex = knex;
  }

  //Get favourite recipes
  getFavouriteRecipe(userid) {
    return this.knex("users_favourite_recipes")
      .select("recipe_id")
      .where("user_id", userid)
      .then((data) => {
        return data;
      })
      .catch((err) => res.status(500).json(err));
  }

  //Get recipe table for favourite recipe
  favouriteRecipeInfo(bookmarkArr) {
    return (
      this.knex("recipes")
        .select(
          "api_id",
          "title",
          "author",
          "summary",
          "instructions",
          "rating",
          "image_path",
          "servings",
          "difficulty"
        )
        // .select("*")
        .whereIn("api_id", bookmarkArr)
        .then((data) => data)
    );
  }

  //Check if recipe already in favourite recipes list
  checkFavouritelist(userid, recipeid) {
    return this.knex("users_favourite_recipes")
      .where("user_id", userid)
      .andWhere("recipe_id", recipeid)
      .then((data) => {
        return data.length > 0 ? true : false;
      });
  }

  //Add recipe to favourite recipes
  addFavouriteRecipe(userid, recipeid) {
    return this.knex("users_favourite_recipes")
      .insert({
        user_id: userid,
        recipe_id: recipeid,
      })
      .then(() => {
        console.log(`(addFavoriteRecipe) Success ${userid} ${recipeid}`);
      })
      .catch((err) => res.status(500).json(err));
  }
  //Remove recipe from favourite recipes
  removeFavouriteRecipe(userid, recipeid) {
    return this.knex("users_favourite_recipes")
      .where("recipe_id", recipeid)
      .andWhere("user_id", userid)
      .del();
  }

  getUploadedRecipe(userid) {
    return this.knex("users_uploaded_recipes")
      .where("user_id", userid)
      .select("recipe_id")
      .then((data) => {
        return data;
      })
      .catch((err) => res.status(500).json(err));
  }
};
