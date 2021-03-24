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
    // let recipeInstructions = stepArr.join("@@");
    return this.knex("recipes")
      .insert([
        {
          api_id: data.id,
          title: data.title,
          summary: data.summary,
          author: data.sourceName,
          preparation_time: data.readyInMinutes,
          image_path: data.image,
          instructions: stepArr,
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

  list(recipeid, userid) {
    return this.knex
      .select(
        "reviews.user_id",
        "reviews.recipe_id",
        "reviews.rating",
        "reviews.comment",
        "users.username"
      )
      .from("reviews")
      .innerJoin("recipes", "reviews.recipe_id", "recipes.id")
      .innerJoin("users", "reviews.user_id", "users.id")
      .where("recipes.id", recipeid)
      .andWhere("reviews.user_id", userid)
      .then((data) => {
        console.log(data);
        return data;
      });
  }

  listall(recipeid, userid) {
    return this.knex
      .select(
        "reviews.user_id",
        "reviews.recipe_id",
        "reviews.rating",
        "reviews.comment",
        "users.username"
      )
      .from("reviews")
      .innerJoin("recipes", "reviews.recipe_id", "recipes.id")
      .innerJoin("users", "reviews.user_id", "users.id")
      .where("recipes.id", recipeid)
      .whereNot("reviews.user_id", userid)
      .orderBy("reviews.created_at")
      .then((data) => {
        return data;
      });
  }

  add(recipeid, userid, comment, rating) {
    if (userid) {
      return this.knex("reviews").insert([
        {
          user_id: userid,
          recipe_id: recipeid,
          comment: comment,
          rating: rating,
        },
      ]);
    } else {
      throw new Error("Cannot add note from non-existent user");
    }
  }

  update(recipeid, userid, comment, rating) {
    return this.knex("reviews")
      .where("user_id", userid)
      .andWhere("recipe_id", recipeid)
      .update({ comment: comment, rating: rating });
  }

  remove(recipeid, userid) {
    return this.knex("reviews")
      .where("recipe_id", recipeid)
      .andWhere("user_id", userid)
      .del()
      .catch((err) => console.error(err));
  }
};
