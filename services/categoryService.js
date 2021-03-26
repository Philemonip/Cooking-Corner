class categoryService {
  constructor(knex) {
    this.knex = knex;
  }

  getRecipeCuisine(recipe_id) {
    return this.knex
      .select("cuisine_name")
      .from("recipes_cuisines")
      .where("recipe_id", recipe_id)
      .then((rows) => {
        console.log(`(getRecipeCuisine) Success ${rows}`);
        return rows;
      })
      .catch((error) => {
        console.log(`(insertRecipeCuisine) Error ${recipe_id}, ${error}`);
      });
  }

  // eg select rc.cuisine_name, r.* from recipes r inner join recipes_cuisines rc on r.id = rc.recipe_id where rc.cuisine_name = 'Japanese' order by rating desc;
  getRecipeByCuisine(cuisine_name) {
    return this.knex
      .select("recipes_cuisines.cuisine_name", "recipes.*")
      .from("recipes")
      .innerJoin("recipes_cuisines", "recipes_cuisines.recipe_id", "recipes.id")
      .where("recipes_cuisines.cuisine_name", cuisine_name)
      .orderBy("rating", "desc")
      .then((rows) => {
        console.log(`(getRecipeByCuisine) Success`);
        return rows;
      })
      .catch((error) => {
        console.log(`(getRecipeByCuisine) Error, ${error}`);
      });
  }

  getRecipeWithCuisine(number) {
    return this.knex
      .select("recipes_cuisines.cuisine_name", "recipes.*")
      .from("recipes")
      .innerJoin("recipes_cuisines", "recipes_cuisines.recipe_id", "recipes.id")
      .then((rows) => {
        return rows;
      });
  }

  insertRecipeCuisine(recipe_id, cuisine_name) {
    return this.knex("recipes_cuisines")
      .insert({ recipe_id: recipe_id, cuisine_name: cuisine_name })
      .then(() => {
        console.log(
          `(insertRecipeCuisine) Success ${recipe_id}, ${cuisine_name}`
        );
      })
      .catch((error) => {
        console.log(
          `(insertRecipeCuisine) Error ${recipe_id}, ${cuisine_name}, ${error}`
        );
      });
  }

  checkRecipeCuisineExist(recipe_id, cuisine_name) {
    return this.knex("recipes_cuisines")
      .select()
      .where({ recipe_id: recipe_id, cuisine_name: cuisine_name })
      .then((rows) => {
        console.log(
          "(checkRecipeCuisineExist) checkRecipeCuisineExist: ",
          rows
        );
        return !!rows.length;
      })
      .catch((error) => {
        console.log("(checkRecipeCuisineExist) error", error);
      });
  }

  addRecipeCuisineIfNotExist(recipe_id, cuisine_name) {
    return this.checkRecipeCuisineExist(recipe_id, cuisine_name).then(
      (isExist) => {
        if (!isExist) {
          this.insertRecipeCuisine(recipe_id, cuisine_name);
        } else {
          console.log("(addRecipeCuisineIfNotExist) Cuisine exists");
        }
      }
    );
  }
}

module.exports = categoryService;
