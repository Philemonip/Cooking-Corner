const express = require("express");
const { isLoggedIn } = require("./loginRouter");

const knex = require("knex")({
  client: "postgresql",
  connection: {
    database: process.env.DATABASE,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
});

class recipeRouter {
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
    this.isLoggedIn = function (req, res, next) {
      console.log(req.user);
      if (req.isAuthenticated()) {
        return next();
      }
      const url = req.originalUrl;
      console.log("redirect-query", url);
      // res.redirect(`/login?redirect=${url}`);
      res.redirect(`/login`);
    };
  }

  router() {
    let router = express.Router();
    // router.get("/api/users", this.getAllRecipe.bind(this));
    router.get("/:id", this.fetchRecipe.bind(this));
    router.post("/:id", this.postReview.bind(this));
    router.put("/:id", this.putReview.bind(this));
    router.delete("/:id", this.deleteReview.bind(this));
    // router.post("/insert", this.postRecipe.bind(this));

    // router.put("/api/users/:id", this.editUser.bind(this));
    // router.delete("/api/users/:id", this.deleteUser.bind(this));
    return router;
  }

  async fetchRecipe(request, response) {
    let id = request.params.id;

    let user = request.user;
    console.log(user);
    console.log("fetchRecipe " + id);

    let apiData = await this.recipeService.fetchRecipeByAPI(id);
    
    let recipeFromDB = await this.recipeService.getRecipeByApiId(id);
    
    let recipe_id = undefined;

    if (recipeFromDB.length === 0) {
      // if recipe not exist in DB, insert it and get recipe_id
      let recipe = {};
      recipe["api_id"] = id;
      recipe["title"] = apiData["title"];
      recipe["author"] = apiData["sourceName"];
      recipe["summary"] = apiData["summary"];
      recipe["instructions"] = apiData["analyzedInstructions"];
      recipe["preparation_time"] = apiData["readyInMinutes"];
      recipe["image_path"] = apiData["image"];
      recipe["servings"] = apiData["servings"];
      recipe["rating"] = apiData["spoonacularScore"];
      recipe["difficulty"] = 5; //hardcoded

      console.log(recipe);
      // get recipe_id after inserting recipe
      recipe_id = await this.recipeService.addRecipe(recipe).then((value) => {
        return value;
      });

      let ingredients_array = apiData.extendedIngredients;

      for (let j = 0; j < ingredients_array.length; j++) {
        let check = await this.ingredientService.addIngredientIfNotExist({
          id: ingredients_array[j]["id"],
          ingredient_name: ingredients_array[j]["nameClean"],
        });
      }

      for (let j = 0; j < ingredients_array.length; j++) {
        let ingredient = {};
        ingredient["recipe_id"] = recipe_id;
        ingredient["ingredient_id"] = ingredients_array[j]["id"];
        ingredient["quantity"] = ingredients_array[j]["amount"];
        ingredient["unit"] = ingredients_array[j]["unit"];

        let addIngredient = await this.ingredientService.addIngredient(
          ingredient
        );
      }

      let cuisine_array = apiData.cuisines;
      if (cuisine_array !== undefined) {
        if (cuisine_array.length > 0) {
          for (let j = 0; j < cuisine_array.length; j++) {
            let insertCuisine = await this.categoryService.insertRecipeCuisine(
              recipe_id,
              cuisine_array[j]
            );
          }
        }
      }
    } else {
      // if recipe exist in DB, get recipe_id
      recipe_id = (await this.recipeService.getRecipeByApiId(id))[0]["id"];
      console.log(recipe_id);
    }

    var myReview = [];
    var recipeReview = [];
    if (request.isAuthenticated()) {
      myReview = await this.reviewService.list(recipe_id, user.id);
      recipeReview = await this.reviewService.listall(recipe_id, user.id);
    }
    // else{
    //   recipeReview = await this.reviewService.listByRecipeID(recipe_id);
    // }

    apiData["myReview"] = myReview;
    apiData["recipeReview"] = recipeReview;
    
    // related recipes
    let numberOfSimilar = 3;
    let similarRecipesArray = await this.recipeService.fetchRelatedRecipes(
      id,
      numberOfSimilar
    );
    console.log(`similarRecipesArray ${similarRecipesArray}`);
    console.log(similarRecipesArray);
    // if(similarRecipesArray.length > 0){
    //   for(let j = 0; j < Math.min(similarRecipesArray.length, numberOfSimilar); j++){
    //     let similarRecipe = await this.recipeService.fetchRecipeByAPI(id);
    //   }
    // }

    console.log("final", apiData);

    let renderInstructions = apiData.analyzedInstructions.split("@@");

    response.render("recipes", {
      user: user,
      title: apiData.title,
      api_id: apiData.id,
      author: apiData.sourceName,
      image: apiData.image,
      time: apiData.readyInMinutes,
      servings: apiData.servings,
      score: apiData.spoonacularScore,
      summary: apiData.summary,
      ingredients: apiData.extendedIngredients,
      instructions: renderInstructions,
      myReview: myReview,
      recipeReview: recipeReview,
      similarRecipesArray: similarRecipesArray,
    });
  }

  async postReview(req, res) {
    if (req.isAuthenticated()) {
      //  console.log(req.user);
      // console.log("PASSPORT", req.session.passport.user.id);
      return this.reviewService
        .add(req.params.id, req.user.id, req.body.note, req.body.rating)
        .then(() => {
          console.log("OUT OF DATABASE redirect");
          res.redirect("/");
        })
        .catch((err) => res.status(500).json(err));

      // .then(() => {
      //   res.redirect("/");
      // });
    }
  }

  async putReview(req, res) {
    console.log("UPDATE REVIEW", req.user);
    return this.reviewService
      .update(req.params.id, req.user.id, req.body.edit, req.body.rating)
      .then(() => res.send("put"))
      .catch((err) => res.status(500).json(err));
  }

  async deleteReview(req, res) {
    console.log("delete review");
    return this.reviewService
      .remove(req.params.id, req.user.id)
      .then(() => res.send("delete"))
      .catch((err) => res.status(500).json(err));
  }

  // async fetchRecipe(request, response) {
  //   let id = request.params.id;
  //   console.log("fetchRecipe " + id);

  //   return this.recipeService.fetchRecipeByAPI(id).then((apiData) => {
  //     // response.render("recipes", { recipe: apiData });
  //     return apiData;
  //   })
  //     .then(async (apiData) => {
  //       this.recipeService.getRecipeByApiId(id).then((rows) => {
  //         // console.log("apiData");
  //         // console.log(apiData);  // can print

  //         // console.log("fetch getRecipeByApiId row");
  //         // console.log(rows);
  //         if (rows.length === 0) {
  //           // console.log("insert");

  //           // build recipe object for inserting into "recipes" table
  //           let recipe = {};
  //           recipe["api_id"] = id;
  //           recipe["title"] = apiData["title"];
  //           recipe["author"] = apiData["sourceName"];
  //           recipe["summary"] = apiData["summary"];
  //           recipe["instructions"] = apiData["analyzedInstructions"];
  //           recipe["preparation_time"] = apiData["readyInMinutes"];
  //           recipe["image_path"] = apiData["image"];
  //           recipe["servings"] = apiData["servings"];
  //           recipe["difficulty"] = 5;  //hardcoded

  //           // console.log("recipe");
  //           // console.log(recipe);

  //           // build ingredients object for inserting into "recipes_ingredients" table
  //           let ingredients_array = apiData.extendedIngredients;  //array of object (from recipeService.fetchRecipeByAPI.ingredients_array)

  //           // console.log("ingredients");
  //           // console.log(ingredients_array); // [{ id: 11959, nameClean: 'arugula', amount: 1, unit: 'handful' }, ]

  //           // insert recipe into "recipes" table
  //           this.recipeService.addRecipe(recipe)
  //             .then(async (recipe_id) => {
  //               console.log(`recipe_id: ${recipe_id}`);
  //               return recipe_id;
  //             })
  //             .then(async (recipe_id) => {
  //               // update the recipe id
  //               apiData["recipe_id"] = recipe_id;
  //               console.log("inside this.recipeService.addRecipe: ", apiData["recipe_id"]);

  //               // insert recipe into "recipes_ingredients" table
  //               for (let j = 0; j < ingredients_array.length; j++) {

  //                 let ingredient = {};
  //                 ingredient["recipe_id"] = recipe_id;
  //                 ingredient["ingredient_id"] = ingredients_array[j]["id"];
  //                 ingredient["quantity"] = ingredients_array[j]["amount"];
  //                 ingredient["unit"] = ingredients_array[j]["unit"];

  //                 console.log(`(recipeRoute)ingredient_id: ${ingredient["ingredient_id"]}`);

  //                 let check = await this.ingredientService.addIngredientIfNotExist({ id: ingredients_array[j]["id"], ingredient_name: ingredients_array[j]["nameClean"] });
  //                 // let addIngredient = await this.ingredientService.addIngredient(ingredient);

  //               }

  //               for (let j = 0; j < ingredients_array.length; j++) {
  //                 let ingredient = {};
  //                 ingredient["recipe_id"] = recipe_id;
  //                 ingredient["ingredient_id"] = ingredients_array[j]["id"];
  //                 ingredient["quantity"] = ingredients_array[j]["amount"];
  //                 ingredient["unit"] = ingredients_array[j]["unit"];
  //                 console.log(`(recipeRoute 2nd loop)ingredient_id: ${ingredient["ingredient_id"]}`);
  //                 let addIngredient = await this.ingredientService.addIngredient(ingredient);
  //               }
  //             })
  //         }
  //       })
  //       //   .then(() => {
  //       //     // console.log(apiData);  //ok
  //       //     // return apiData; //cannot return out
  //       //   })
  //       return apiData;
  //     })
  //     .then(async (apiData) => {
  //       console.log("apiData");
  //       console.log(apiData);
  //       // console.log(apiData["recipe_id"]);
  //       // console.log(apiData["recipe_id"]===undefined)

  //       let result = {};

  //       console.log("testing: ");
  //       if (apiData["recipe_id"] === undefined) {
  //         console.log("get id in review by api id: ", apiData["id"]);
  //         apiData["recipe_id"] = await this.recipeService.getRecipeByApiId(200005)
  //           .then((rows) => {
  //             console.log("testing row: ", rows);
  //             return rows[0]["id"];
  //           });
  //       }

  //       console.log("inside review: ", apiData["recipe_id"]);
  //       if (apiData["recipe_id"] === undefined) {
  //         console.log("get id in review by api id: ", apiData["id"]);
  //         apiData["recipe_id"] = await this.recipeService.getRecipeByApiId(apiData["id"])
  //           .then((rows) => {
  //             console.log("inside review row: ", rows);
  //             return rows[0]["id"];
  //           });
  //       }

  //       // result["api_id"] = apiData.id;
  //       // result["title"] = apiData.title;
  //       // result["summary"] = apiData.summary;
  //       // result["author"] = apiData.sourceName;
  //       // result["preparation_time"] = apiData.readyInMinutes;
  //       // result["image_path"] = apiData.image;
  //       // result["instructions"] = apiData.analyzedInstructions.split("@@");
  //       // result["servings"] = apiData.servings;
  //       // result["ingredients"] = apiData.extendedIngredients;
  //       // console.log("result1")
  //       // console.log(result)

  //       const myReview = await this.reviewService.list(apiData["recipe_id"], 1);
  //       const recipeReview = await this.reviewService.listall(apiData["recipe_id"], 1);

  //       apiData["myReview"] = myReview;
  //       apiData["recipeReview"] = recipeReview;

  //       console.log(myReview);
  //       console.log(recipeReview);
  //       // console.log(myReview);
  //       // console.log(recipeReview);
  //       // result["myReviewArr"] = myReview;
  //       // result["reviewArr"] = recipeReview;

  //       // console.log("result2")
  //       // console.log(result)

  //       // console.log(result);
  //       response.render("recipes", { recipe: apiData });
  //       // return apiData;
  //     })
  // }
  // postRecipe(request, response) {
  //   let body = request.body;
  //   // console.log(body);
  //   // console.log(body.title);
  //   // response.send("Hello");

  //   // return this.recipeServiceTmp.addRecipe(body)
  //   //     .then((id) => {
  //   //         console.log("success")
  //   //         console.log(id)
  //   //         // response.send("insertrecipesTmp");
  //   //     });

  //   let recipes_table = (({ title, author, summary, instructions, preparation_time, image_path, servings, difficulty }) => ({ title, author, summary, instructions, preparation_time, image_path, servings, difficulty }))(body);
  //   // let ingredients_table = (({ ingredientsid1, ingredientsid2 }) => ({ ingredientsid1, ingredientsid2 }))(body);

  //   recipes_table["api_id"] = 0;
  //   console.log(recipes_table);
  //   return this.recipeServiceTmp.addRecipe(recipes_table)
  //     .then((id) => {
  //       console.log("success");
  //       console.log(id);
  //       console.log(body);

  //       // let ingredients = {"recipe_id": id, "ingredient_id": body["ingredientsid1"], "quantity": body["quantity1"], "unit": body["unit1"]};
  //       let ingredients = { "recipe_id": id, "ingredient_id": body["ingredientsid1"][0], "quantity": body["ingredientsid1"][1], "unit": body["ingredientsid1"][2] };
  //       console.log(ingredients);

  //       this.ingredientServiceTmp.addIngredient(ingredients)
  //         .then(() => {
  //           console.log("insert ingredient success");
  //         })

  //       ingredients = { "recipe_id": id, "ingredient_id": body["ingredientsid2"][0], "quantity": body["ingredientsid2"][1], "unit": body["ingredientsid2"][2] };
  //       this.ingredientServiceTmp.addIngredient(ingredients)
  //         .then(() => {
  //           console.log("insert ingredient success");
  //         })
  //     })
  // }
}

module.exports = recipeRouter;
