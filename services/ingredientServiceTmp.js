const knexConfig = require("../knexfile")["development"];
const knex = require("knex")(knexConfig);

class ingredientServiceTmp {
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

    // getRecipeByApiId(api_id) {
    //     return this.knex("recipes")
    //         .select()
    //         .where({ api_id: api_id }).then((row) => {
    //             return row;
    //         })
    // }
}

module.exports = ingredientServiceTmp;