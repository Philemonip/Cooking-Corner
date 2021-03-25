const knexConfig = require("../knexfile")["development"];
const knex = require("knex")(knexConfig);

class ingredientService {
  constructor(knex) {
    this.knex = knex;
  }

  getIngredientByRecipeId(id) {
    return this.knex("recipes_ingredients")
      .select()
      .where({ recipe_id: id })
      .then((row) => {
        return row;
      });
  }

  addIngredient(ingredients) {
    return this.knex("recipes_ingredients")
      .insert(ingredients)
      .then(() => {
        console.log("ingredients inserted");
        return true;
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  checkIngredientExist(ingredient_id) {
    return this.knex("ingredients")
      .select()
      .where({ id: ingredient_id })
      .then((rows) => {
        console.log(rows);
        return !!rows.length;
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  addIngredientIfNotExist(ingredient) {
    return this.checkIngredientExist(ingredient["id"]).then((isExist) => {
      if (!isExist) {
        this.knex("ingredients")
          .insert(ingredient)
          .then(() => {
            console.log("New ingredients inserted, ID: " + ingredient["id"]);
          })
          .catch((error) => {
            console.log("error", error);
          });
      } else {
        console.log("Ingredient exists");
      }
    });
  }
}

module.exports = ingredientService;
