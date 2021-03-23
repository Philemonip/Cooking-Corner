require("dotenv").config();

const knex = require("knex")({
  client: "postgresql",
  connection: {
    database: process.env.DATABASE,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
});

module.exports = class RecipeService {
  constructor(knex) {
    this.knex = knex;
  }

  //Check if recipe data already in database
  checkData(recipeId) {
    return this.knex("recipes")
      .where({ api_id: recipeId })
      .then((data) => {
        console.log(data.length);
        return data.length > 0 ? true : false;
      });
  }

  //Insert data from recipe API to our own database
  insert(data) {
    let stepArr = data.analyzedInstructions[0].steps.map((x) => (x = x.step));
    let recipeInstructions = stepArr.join("@@");
    return this.knex("recipes")
      .insert([
        {
          api_id: data.id,
          title: data.title,
          summary: data.summary,
          author: data.sourceName,
          preparation_time: data.readyInMinutes,
          image_path: data.image,
          instructions: recipeInstructions,
          servings: data.servings,
        },
      ])
      .then(() => {
        return this.knex("recipes_cuisines").insert([
          {
            cuisine_name: data.cuisines,
          },
        ]);
        //   .then(() => {
        //     return this.knex("recipes_ingredients").insert([
        //       {
        //         ingredient_names: data.extendedIngredients,
        //       },
        //     ]);
        //   });
      });
  }

  getRecipeByApiId(api_id) {
    return this.knex("recipes")
      .select()
      .where({ api_id: api_id })
      .then((row) => {
        console.log(row);
        return row;
      });
  }
};
