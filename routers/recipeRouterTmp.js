// const recipeService = require("../services/recipeService");
const express = require("express");

class recipeRouterTmp {
    constructor(recipeServiceTmp, ingredientServiceTmp) {
        this.recipeServiceTmp = recipeServiceTmp;
        this.ingredientServiceTmp = ingredientServiceTmp;
    }
    router() {
        let router = express.Router();
        // router.get("/api/users", this.getAllRecipe.bind(this));
        router.get("/:id", this.getRecipe.bind(this));
        router.post("/insert", this.postRecipe.bind(this));

        // router.put("/api/users/:id", this.editUser.bind(this));
        // router.delete("/api/users/:id", this.deleteUser.bind(this));
        return router;
    }

    getRecipe(request, response) {
        let id = request.params.id;
        return this.recipeServiceTmp.getRecipeById(id).then((recipe) => {
            recipe[0]["instructions"] = JSON.parse(recipe[0]["instructions"]);
            response.render("recipesTmp", { recipe: recipe[0] });
            // response.send(recipe);
        })
    }

    postRecipe(request, response) {
        let body = request.body;
        // console.log(body);
        // console.log(body.title);
        // response.send("Hello");
        
        // return this.recipeServiceTmp.addRecipe(body)
        //     .then((id) => {
        //         console.log("success")
        //         console.log(id)
        //         // response.send("insertrecipesTmp");
        //     });

        let recipes_table = (({ title, author, summary, instructions, preparation_time, image_path, servings, difficulty }) => ({ title, author, summary, instructions, preparation_time, image_path, servings, difficulty }))(body);
        // let ingredients_table = (({ ingredientsid1, ingredientsid2 }) => ({ ingredientsid1, ingredientsid2 }))(body);

        recipes_table["api_id"] = 0;
        console.log(recipes_table);
        return this.recipeServiceTmp.addRecipe(recipes_table)
            .then((id) => {
                console.log("success");
                console.log(id);
                console.log(body);

                
                // let ingredients = {"recipe_id": id, "ingredient_id": body["ingredientsid1"], "quantity": body["quantity1"], "unit": body["unit1"]};
                let ingredients = {"recipe_id": id, "ingredient_id": body["ingredientsid1"][0], "quantity": body["ingredientsid1"][1], "unit": body["ingredientsid1"][2]};
                console.log(ingredients);
                
                this.ingredientServiceTmp.addIngredient(ingredients)
                .then(() => {
                    console.log("insert ingredient success");
                })

                ingredients = {"recipe_id": id, "ingredient_id": body["ingredientsid2"][0], "quantity": body["ingredientsid2"][1], "unit": body["ingredientsid2"][2]};
                this.ingredientServiceTmp.addIngredient(ingredients)
                .then(() => {
                    console.log("insert ingredient success");
                })
            })
    }



    // getAllRecipe(request, response) {
    //     this.userService.getRecipe().then((users) => {
    //         response.send(users);
    //     })
    // }

    // getRecipe(request, response) {
    //     let id = request.params.id;
    //     return this.recipeService.getRecipe(id).then((user) => {
    //         response.send(user);
    //     })
    // }

    // postUser(request, response) {
    //     let body = request.body;
    //     console.log(body);
    //     return this.userService.postUser(body)
    //         .then(() => {
    //             response.send("added");
    //         });
    // }

    // editUser(request, response) {
    //     let id = request.params.id;
    //     let user = request.body;
    //     console.log("id", id);
    //     console.log("user", user);
    //     return this.userService.editUser(id, user)
    //         .then(() => {
    //             console.log("updated");
    //         })
    // }

    // deleteUser(request, response) {
    //     let id = request.params.id;
    //     return this.userService.deleteUser(id)
    //         .then(() => {
    //             response.send("deleted");
    //         })
    // }
}

module.exports = recipeRouterTmp;
