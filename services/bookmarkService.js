module.exports = class BookmarkService {
  constructor(knex) {
    this.knex = knex;
  }

  //Get favourite recipes
  getFavouriteRecipe(userid) {
    return this.knex("users_favourite_recipes")
      .select("recipe_id", "id")
      .orderBy("id", "asc")
      .where("user_id", userid)
      .then((data) => {
        console.log("GET bookmark recipe", data);
        return data;
      })
      .catch((err) => res.status(500).json(err));
  }

  //Get recipe table for favourite recipe
  favouriteRecipeInfo(bookmarkArr, user) {
    return (
      this.knex("users_favourite_recipes")
        .select([
          "recipes.api_id",
          "recipes.title",
          "recipes.author",
          "recipes.summary",
          "recipes.instructions",
          "recipes.rating",
          "recipes.image_path",
          "recipes.servings",
          "recipes.difficulty",
        ])
        // .select("*")
        .innerJoin(
          "recipes",
          "recipes.api_id",
          "users_favourite_recipes.recipe_id"
        )
        .innerJoin("users", "users.id", "users_favourite_recipes.user_id")
        .whereIn("api_id", bookmarkArr)
        .andWhere("users_favourite_recipes.user_id", user)
        .orderBy("users_favourite_recipes.id", "asc")
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
};
