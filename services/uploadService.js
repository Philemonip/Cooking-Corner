module.exports = class UploadService {
  constructor(knex) {
    this.knex = knex;
  }

  //Get favourite recipes
  getUploadedRecipe(userid) {
    return this.knex("users_uploaded_recipes")
      .select("recipe_id")
      .where("user_id", userid)
      .then((data) => {
        return data;
      })
      .catch((err) => res.status(500).json(err));
  }

  uploadedRecipeInfo(uploadArr) {
    return (
      this.knex("recipes")
        .select(
          "id",
          "title",
          "author",
          "summary",
          "instructions",
          "rating",
          "servings",
          "difficulty"
        )
        // .select("*")
        .whereIn("id", uploadArr)
        .then((data) => data)
    );
  }

  removeUploadedRecipe(userid, recipeid) {
    return this.knex("users_uploaded_recipes")
      .where("recipe_id", recipeid)
      .andWhere("user_id", userid)
      .del();
  }
};
