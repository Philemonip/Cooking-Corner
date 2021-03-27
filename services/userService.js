class userService {
  constructor(knex) {
    this.knex = knex;
  }

  getFavoriteRecipe(user_id) {
    return this.knex("users_favourite_recipes")
      .select()
      .where(user_id, user_id)
      .then((rows) => {
        console.log(`(getFavoriteRecipe) Success ${user_id}`);
        return rows;
      })
      .catch((error) => {
        console.log(`(getFavoriteRecipe) Error, ${error}`);
      });
  }

  addFavoriteRecipe(user_id, recipe_id) {
    return this.knex("users_favourite_recipes")
      .insert({ user_id: user_id, recipe_id: recipe_id })
      .then(() => {
        console.log(`(addFavoriteRecipe) Success ${user_id} ${recipe_id}`);
      })
      .catch((error) => {
        console.log(`(addFavoriteRecipe) Error, ${error}`);
      });
  }
}

module.exports = userService;
