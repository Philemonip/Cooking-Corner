module.exports = class UploadService {
  constructor(knex) {
    this.knex = knex;
  }

  //Get favourite recipes ID and return an array
  getUploadedRecipe(userid) {
    return this.knex("users_uploaded_recipes")
      .select("recipe_id")
      .where("user_id", userid)
      .then((data) => {
        return data.map((x) => x["recipe_id"]);
      });
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
        .then((data) => {
          return data;
        })
    );
  }

  removeUploadedRecipe(userid, recipeid) {
    return this.knex("users_uploaded_recipes")
      .where("recipe_id", recipeid)
      .andWhere("user_id", userid)
      .del();
  }
};
