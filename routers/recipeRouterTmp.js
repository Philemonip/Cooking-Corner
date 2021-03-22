const recipeService = require("../services/recipeService");
const express = require("express");

class recipeRouterTmp {
    constructor(recipeServiceTmp) {
        this.recipeServiceTmp = recipeServiceTmp;
    }
    router() {
        let router = express.Router();
        // router.get("/api/users", this.getAllRecipe.bind(this));
        router.get("/:id", this.getRecipe.bind(this));
        // router.post("/api/users", this.postUser.bind(this));
        // router.put("/api/users/:id", this.editUser.bind(this));
        // router.delete("/api/users/:id", this.deleteUser.bind(this));
        return router;
    }

    getRecipe(request, response) {
        let id = request.params.id;
        return this.recipeServiceTmp.getRecipeById(id).then((recipe) => {
            recipe[0]["instructions"] = JSON.parse(recipe[0]["instructions"]);
            response.render("recipesTmp", {recipe: recipe[0]});
            // response.send(recipe);
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