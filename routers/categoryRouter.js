const express = require("express");

class categoryRouter {
  constructor(
    recipeService,
    ingredientService,
    reviewService,
    categoryService
  ) {
    this.recipeService = recipeService;
    this.ingredientService = ingredientService;
    this.reviewService = reviewService;
    this.categoryService = categoryService;
  }

  router() {
    let router = express.Router();
    // router.get("/api/users", this.getAllRecipe.bind(this));
    router.get("", this.getRecipes.bind(this));

    // router.get("/:cuisine", this.getCuisineRecipes.bind(this));
    router.get("/cuisine=:cuisine", this.getCuisineRecipes.bind(this));

    router.get("/ingredient=:ingredient", this.getIngredientRecipes.bind(this));

    // router.get("/bookmarks", this.getBookmark.bind(this));

    // router.post("/bookmark/:id", this.postBookmark.bind(this));

    // router.put("/api/users/:id", this.editUser.bind(this));
    // router.delete("/api/users/:id", this.deleteUser.bind(this));
    return router;
  }

  async getRecipes(request, response) {
    console.log(request.params);
    let cuisine = request.params.cuisine;
    console.log(`Get Highest Rating Recipes`);

    let recipes_res = await this.recipeService.getRecipes(6);

    // console.log(recipes_res);

    response.render("category", { cuisine: cuisine, recipes: recipes_res });
  }

  async getCuisineRecipes(request, response) {
    console.log(request.params);
    let cuisine = request.params.cuisine;
    console.log(`Get ${cuisine} Recipes`);

    let recipes_res = await this.categoryService.getRecipeByCuisine(cuisine);

    let recipe_array = [];
    for (let i = 0; i < Math.min(recipes_res.length, 10); i++) {
      recipe_array.push(recipes_res[i]);
    }
    // console.log(recipe_array);

    response.render("category", { cuisine: cuisine, recipes: recipe_array });
  }

  async getIngredientRecipes(request, response) {
    let ingredient = request.params.ingredient.toLowerCase();
    let recipe_id_array = await this.ingredientService.getRecipeIdByIngredient(
      ingredient
    );
    let recipe_array = await this.recipeService.getRecipeByIds(recipe_id_array);
    console.log(`Category Ingredient ${ingredient} Pages`);
    // console.log(recipe_array.length)
    response.render("category", { cuisine: ingredient, recipes: recipe_array });
  }

  // async getBookmark(request, response) {
  //   console.log("bookmark_recipe_id");
  //   let bookmark_recipe_id = await this.userService.getFavoriteRecipe(1); //hardcode
  //   let bookmark_recipes = [];
  //   for (let i = 0; i < bookmark_recipe_id.length; i++) {
  //     let bookmark_recipe = await this.recipeService.getRecipeById(
  //       bookmark_recipe_id[i]["recipe_id"]
  //     );
  //     bookmark_recipes.push(bookmark_recipe[0]);
  //   }
  //   // console.log(bookmark_recipes);
  //   // bookmark_recipes is like this:
  //   // [
  //   //   {
  //   //     id: 1905,
  //   //     api_id: 637908,
  //   //     title: 'Chicken and Miso Ramen Noodle Soup',
  //   //     author: 'Foodista',
  //   //     summary: 'xxxxxxxxxx',
  //   //     instructions: 'xxxxxxxxxxx',
  //   //     preparation_time: 30,
  //   //     image_path: 'https://spoonacular.com/recipeImages/637908-312x231.jpg',
  //   //     servings: '2',
  //   //     difficulty: null,
  //   //     created_at: 2021-03-19T09:20:38.817Z,
  //   //     updated_at: 2021-03-19T09:20:38.817Z,
  //   //     rating: null
  //   //   },
  //   // ]
  //   response.render("category", {
  //     cuisine: "bookmark",
  //     recipes: bookmark_recipes,
  //   });
  // }

  // async postBookmark(request, response) {
  //   let id = request.body.id;
  //   console.log(body);

  //   let recipe_id = response.params.recipe_id;
  //   let user_id = response.params.user_id;

  //   let addFavoriteRecipe = await this.userService.addFavoriteRecipe(
  //     user_id,
  //     recipe_id
  //   );

  //   console.log(`Successfully bookmark recipe ${user_id}, ${recipe_id}, ${id}`);
  // }
}

module.exports = categoryRouter;
