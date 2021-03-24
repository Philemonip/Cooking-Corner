module.exports = class ProfileService {
  constructor(knex) {
    this.knex = knex;
  }

  getFavouriteRecipes(userid) {
    return this.knex("users_favourite_recipes")
      .where("user_id", userid)
      .select("recipe_id")
      .then((data) => {
        return data;
      })
      .catch((err) => res.status(500).json(err));
  }

  getUploadedRecipes(userid) {
    return this.knex("users_uploaded_recipes")
      .where("user_id", userid)
      .select("recipe_id")
      .then((data) => {
        return data;
      })
      .catch((err) => res.status(500).json(err));
  }
};
