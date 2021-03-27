// require("dotenv").config();

// const knex = require("knex")({
//   client: "postgresql",
//   connection: {
//     database: process.env.DATABASE,
//     user: process.env.USERNAME,
//     password: process.env.PASSWORD,
//   },
// });

// module.exports = class RecipeService {
//   constructor(knex) {
//     this.knex = knex;
//   }

//   //Check if recipe data already in database
//   checkData(recipeId) {
//     return this.knex("recipes")
//       .where({ api_id: recipeId })
//       .then((data) => {
//         console.log(data.length);
//         return data.length > 0 ? true : false;
//       });
//   }

//   //Insert data from recipe API to our own database
//   insert(data) {
//     let stepArr = data.analyzedInstructions[0].steps.map((x) => (x = x.step));
//     let recipeInstructions = stepArr.join("@@");
//     return this.knex("recipes")
//       .insert([
//         {
//           api_id: data.id,
//           title: data.title,
//           summary: data.summary,
//           author: data.sourceName,
//           preparation_time: data.readyInMinutes,
//           image_path: data.image,
//           instructions: recipeInstructions,
//           servings: data.servings,
//         },
//       ])
//       .then(() => {
//         return this.knex("recipes_cuisines").insert([
//           {
//             cuisine_name: data.cuisines,
//           },
//         ]);
//         //   .then(() => {
//         //     return this.knex("recipes_ingredients").insert([
//         //       {
//         //         ingredient_names: data.extendedIngredients,
//         //       },
//         //     ]);
//         //   });
//       });
//   }

//   getRecipeByApiId(api_id) {
//     return this.knex("recipes")
//       .select()
//       .where({ api_id: api_id })
//       .then((row) => {
//         console.log(row);
//         return row;
//       });
//   }
// };

const knexConfig = require("../knexfile")["development"];
const knex = require("knex")(knexConfig);
const axios = require("axios");

class recipeService {
  constructor(knex) {
    this.knex = knex;
  }

  fetchRecipeByAPI(recipeId) {
    // let apiData = {};
    return axios
      .get(
        // `https://api.spoonacular.com/recipes/${recipeId}/information?&apiKey=ba5aba2ccf0049008995c74dfc10d62a`
        `https://api.spoonacular.com/recipes/${recipeId}/information?&apiKey=8c216aace06a40e984fb7cb8c8f2b768` //1096010
      )
      .then((info) => {
        let apiData = info.data;
        // console.log(apiData);

        // handle the extendedIngredients
        let ingredients = apiData["extendedIngredients"]; //array of object
        let ingredients_array = []; //array of object
        for (let i = 0; i < ingredients.length; i++) {
          ingredients_array.push(
            (({ id, nameClean, amount, unit }) => ({
              id,
              nameClean,
              amount,
              unit,
            }))(ingredients[i])
          );
        }
        // console.log("ingredients_array");
        // console.log(ingredients_array);
        apiData["extendedIngredients"] = ingredients_array;

        // handle the analyzedInstructions
        // console.log(apiData["analyzedInstructions"][0]["steps"]); //array of object
        let steps = apiData["analyzedInstructions"][0]["steps"];
        let steps_string = "";
        for (let i = 0; i < steps.length; i++) {
          if (i === steps.length - 1) {
            steps_string += steps[i]["step"];
          } else {
            steps_string += steps[i]["step"] + "@@";
          }
        }
        // console.log(steps_string);
        apiData["analyzedInstructions"] = steps_string;

        return apiData;
      });
  }

  fetchRelatedRecipes(api_id, number){
    number = number || 3;
    return axios
      .get(
        // `https://api.spoonacular.com/recipes/${recipeId}/information?&apiKey=ba5aba2ccf0049008995c74dfc10d62a`
        `https://api.spoonacular.com/recipes/${api_id}/similar?number=${number}&apiKey=8c216aace06a40e984fb7cb8c8f2b768` //1096010
      )
      .then((info) => {
        return info.data;
      });
  }

  getRecipes(number) {
    return this.knex("recipes")
      .select()
      .limit(number)
      .orderBy("rating", "desc")
      .then((row) => {
        return row;
      });
  }

  getRecipeById(id) {
    return this.knex("recipes")
      .select()
      .where({ id: id })
      .then((row) => {
        return row;
      });
  }

  getRecipeByIds(id_array, number) {
    number = number || 6;
    return this.knex("recipes")
      .select()
      .whereIn("id", id_array)
      .orderBy("rating", "desc")
      .limit(number)
      .then((row) => {
        return row;
      });
  }

  getRecipeByApiId(api_id) {
    return this.knex("recipes")
      .select()
      .where({ api_id: api_id })
      .then((row) => {
        return row;
      });
  }

  addRecipe(recipe) {
    return this.knex("recipes")
      .returning("id")
      .insert(recipe)
      .then((id) => {
        console.log("inserted");
        console.log(id);
        return id[0];
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
}

module.exports = recipeService;
