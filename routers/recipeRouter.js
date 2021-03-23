// "use strict";
// module.exports = (express) => {
//   console.log("router running");
//   const router = express.Router();
//   const axios = require("axios");

//   // Knex Setup
//   require("dotenv").config();
//   const knex = require("knex")({
//     client: "postgresql",
//     connection: {
//       database: process.env.DATABASE,
//       user: process.env.USERNAME,
//       password: process.env.PASSWORD,
//     },
//   });

//   const RecipeService = require("../services/recipeService");
//   const recipeService = new RecipeService(knex);

//   router.route("/:recipeId").get(getRecipeData);

//   function getRecipeData(req, res) {
//     let apiData;
//     return axios
//       .get(
//         `https://api.spoonacular.com/recipes/${req.params.recipeId}/information?&apiKey=ba5aba2ccf0049008995c74dfc10d62a`
//       )
//       .then((info) => {
//         apiData = info.data;
//         console.log(apiData);
//         return recipeService.checkData(apiData.id);
//       })
//       .then((boolean) => {
//         console.log("yes");
//         if (!boolean) {
//           return recipeService.insert(apiData);
//         } else {
//           return;
//         }
//       })
//       .then(() => {
//         //Send data to res.render
//         res.render("recipes", {
//           api_id: apiData.id,
//           title: apiData.title,
//           summary: apiData.summary,
//           author: apiData.sourceName,
//           preparation_time: apiData.readyInMinutes,
//           image_path: apiData.image,
//           //   instructions: apiData.analyzedInstructions[0].steps.map((x) => (x = x.step)).split("@@"),
//           servings: apiData.servings,
//           ingredients: apiData.ingredients,
//         });
//       })
//       .catch((err) => {
//         console.log("axios get err", err);
//       });
//     //Check if recipe already in database

//     //   apiData = knex
//     //     .select(
//     //       "recipes.api_id",
//     //       "recipes.title",
//     //       "recipes.author",
//     //       "recipes.summary",
//     //       "recipes.instructions",
//     //       "recipes.preparation_time",
//     //       "recipes.image_path",
//     //       "recipes.servings",
//     //       "recipes.difficulty",
//     //       "recipes_ingredients.ingredient_id",
//     //       "recipes_ingredients.quantity",
//     //       "recipes_ingredients.unit"
//     //     )
//     //     .from("recipes")
//     //     .innerJoin(
//     //       "recipes_ingredients",
//     //       "recipes.api_id",
//     //       "recipes_ingredients.api_id"
//     //     )
//     //     .innerJoin(
//     //       "recipes_cuisines",
//     //       "recipes.api_id",
//     //       "recipes_cuisines.api_id"
//     //     )
//     //     .where("recipes.api_id", req.params.recipeId);
//   }

//   return router;
// };


const express = require("express");
// const axios = require("axios");

class recipeRouter {
  // constructor(recipeServiceTmp, ingredientServiceTmp) {
  //   this.recipeServiceTmp = recipeServiceTmp;
  //   this.ingredientServiceTmp = ingredientServiceTmp;
  // }
  constructor(recipeService, ingredientService) {
    this.recipeService = recipeService;
    this.ingredientService = ingredientService;
  }

  router() {
    let router = express.Router();
    // router.get("/api/users", this.getAllRecipe.bind(this));
    router.get("/:id", this.fetchRecipe.bind(this));
    // router.post("/insert", this.postRecipe.bind(this));

    // router.put("/api/users/:id", this.editUser.bind(this));
    // router.delete("/api/users/:id", this.deleteUser.bind(this));
    return router;
  }

  fetchRecipe(request, response) {
    let id = request.params.id;
    console.log("fetchRecipe " + id);
    return this.recipeService.fetchRecipeByAPI(id).then((apiData) => {
        response.render("recipes", { recipe: apiData });
        return apiData;
      })
      .then((apiData) => {
        this.recipeService.getRecipeByApiId(id).then((rows) => {
          // console.log("apiData");
          // console.log(apiData);  // can print
          console.log("row");
          console.log(rows);
          if(rows.length === 0){
            console.log("insert");

            // build recipe object for inserting into "recipes" table
            let recipe = {};
            recipe["api_id"] = id;
            recipe["title"] = apiData["title"];
            recipe["author"] = apiData["sourceName"];
            recipe["summary"] = apiData["summary"];
            recipe["instructions"] = apiData["analyzedInstructions"];
            recipe["preparation_time"] = apiData["readyInMinutes"];
            recipe["image_path"] = apiData["image"];
            recipe["servings"] = apiData["servings"];
            recipe["difficulty"] = 5;  //hardcoded

            console.log("recipe");
            console.log(recipe);

            // build ingredients object for inserting into "recipes_ingredients" table
            let ingredients_array = apiData.extendedIngredients;  //array of object (from recipeService.fetchRecipeByAPI.ingredients_array)

            console.log("ingredients");
            console.log(ingredients_array);

            // insert recipe into "recipes" table
            this.recipeService.addRecipe(recipe)
            .then((recipe_id) => {
              console.log("recipe_id");
              console.log(recipe_id);
              return recipe_id;
            })
            .then((recipe_id) => {
              // insert recipe into "recipes_ingredients" table
              for(let j = 0;j < ingredients_array.length;j++){
                let ingredient = {};
                ingredient["recipe_id"] = recipe_id;
                ingredient["ingredient_id"] = ingredients_array[j]["id"];
                ingredient["quantity"] = ingredients_array[j]["amount"];
                ingredient["unit"] = ingredients_array[j]["unit"];

                console.log("ingredient_id");
                console.log(ingredient["ingredient_id"]);

                // check ingredient id exist in "ingredient"table
                this.ingredientService.addIngredientIfNotExist({id: ingredients_array[j]["id"], ingredient_name: ingredients_array[j]["nameClean"]})
                .then(() => {
                  // insert
                  this.ingredientService.addIngredient(ingredient);
                })
              }
            })
          }
        })
      })
  }

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

