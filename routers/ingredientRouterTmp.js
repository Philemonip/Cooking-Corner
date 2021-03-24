// const recipeService = require("../services/recipeService");
const express = require("express");

class ingredientRouterTmp {
    constructor(ingredientServiceTmp) {
        this.ingredientServiceTmp = ingredientServiceTmp;
    }
    router() {
        let router = express.Router();
        router.get("/:id", this.getIngredient.bind(this));
        return router;
    }

    getIngredient(request, response) {
        let id = request.params.id;
        return this.ingredientServiceTmp.getIngredientByRecipeId(id).then((ingredients) => {
            // console.log(ingredients);
            // recipe[0]["instructions"] = JSON.parse(recipe[0]["instructions"]);
            response.render("ingredientsTmp", {ingredients: ingredients});
            // response.send(recipe);
        })
    }
}

module.exports = ingredientRouterTmp;