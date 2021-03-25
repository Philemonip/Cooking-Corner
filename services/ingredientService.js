const knexConfig = require("../knexfile")["development"];
const knex = require("knex")(knexConfig);

class ingredientService {
    constructor(knex) {
        this.knex = knex;
    }

    getIngredientByRecipeId(id) {
        return this.knex("recipes_ingredients")
            .select()
            .where({ recipe_id: id }).then((row) => {
                return row;
            })
    }

    addIngredient(ingredients) {
        return this.knex("recipes_ingredients")
            .insert(ingredients)
            .then(() => {
                console.log("(addIngredient)ingredients inserted");
            })
            .catch((error) => {
                console.log("(addIngredient)error ", ingredients, error);
            });
    }

    checkIngredientExist(ingredient_id){
        return this.knex("ingredients")
            .select()
            .where({id: ingredient_id})
            .then((rows) => {
                console.log("(checkIngredientExist)checkIngredientExist: ", rows);
                return !!(rows.length);
            })
            .catch((error) => {
                console.log("(checkIngredientExist)error", error);
            });
    }

    addIngredientIfNotExist(ingredient) {
        return this.checkIngredientExist(ingredient["id"])
        .then((isExist) => {
            if(!isExist){
                this.knex("ingredients")
                .insert(ingredient)
                .then(() => {
                    console.log("(addIngredientIfNotExist)New ingredients inserted, ID: " + ingredient["id"]);
                })
                .catch((error) => {
                    console.log("(addIngredientIfNotExist)error", error);
                });
            }
            else{
                console.log("(addIngredientIfNotExist)Ingredient exists")
            }
        })
    }
}

module.exports = ingredientService;