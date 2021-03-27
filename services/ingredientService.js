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

  // select distinct ri.recipe_id from recipes_ingredients ri inner join ingredients i on ri.ingredient_id = i.id where i.ingredient_name like '%chicken%';
  // return array of recipe_id
  getRecipeIdByIngredient(ingredient){
    return this.knex.select()
                    .distinct("recipes_ingredients.recipe_id")
                    .from("recipes_ingredients")
                    .innerJoin("ingredients", "recipes_ingredients.ingredient_id", "ingredients.id")
                    .where('ingredients.ingredient_name', 'like', `%${ingredient}%`)
                    .then((rows) => {
                      return rows.map(x => x["recipe_id"]);
                    })

  }
}

module.exports = ingredientService;
