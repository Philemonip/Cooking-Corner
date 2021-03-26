// const knexConfig = require("../knexfile")["development"];
// const knex = require("knex")(knexConfig);

class reviewService {
  constructor(knex) {
    this.knex = knex;
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
      .innerJoin("recipes", "reviews.recipe_id", "recipes.api_id")
      .innerJoin("users", "reviews.user_id", "users.id")
      .where("recipes.id", recipeid)
      .andWhere("reviews.user_id", userid)
      .then((data) => {
        // console.log(data);
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
      .innerJoin("recipes", "reviews.recipe_id", "recipes.api_id")
      .innerJoin("users", "reviews.user_id", "users.id")
      .where("recipes.id", recipeid)
      .whereNot("reviews.user_id", userid)
      .orderBy("reviews.created_at")
      .then((data) => {
        // console.log(data);
        return data;
      });
  }

  add(recipeid, userid, comment, rating) {
    console.log(recipeid, userid, comment, rating);

    // return this.knex("test").insert({ name: "Attempt" });
    return this.knex
      .insert({
        user_id: userid,
        recipe_id: recipeid,
        rating: rating,
        comment: comment,
      })
      .into("reviews")
      .catch((err) => console.log(err));

    // .then(() => {
    //   console.log("inserted");
    //   return;
    // });

    // await this.knex
    //   .insert({
    // user_id: 1,
    // recipe_id: 9999,
    // comment: "comment",
    // rating: 3,
    //   })
    //   .into("reviews");
    // console.log("YO");
    // return;
    // if (userid) {
    //   console.log("Here");
    //   console.log(this.knex);
    //   let query = this.knex("reviews").insert({
    // user_id: 1,
    // recipe_id: 9999,
    // comment: "comment",
    // rating: 3,
    //   });

    //   query.then(() => {
    //     console.log("finsihed");
    //     return true;
    //   });
    //   console.log("FAILED out of the if?!");
    // } else {
    //   console.log("Here error!");

    //   throw new Error("Cannot add note from non-existent user");
    // }
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
}

module.exports = reviewService;
