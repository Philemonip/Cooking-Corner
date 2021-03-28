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
      // .innerJoin("recipes", "reviews.recipe_id", "recipes.id")
      .innerJoin("users", "reviews.user_id", "users.id")
      .where("recipes.id", recipeid)
      .andWhere("reviews.user_id", userid)
      .then((data) => {
        // console.log(data);
        return data;
      });
  }

  listall(recipeid, userid) {
    let query = this.knex
      .select(
        "reviews.user_id",
        "reviews.recipe_id",
        "reviews.rating",
        "reviews.comment",
        "users.username"
      )
      .from("reviews")
      .innerJoin("recipes", "reviews.recipe_id", "recipes.api_id")
      // .innerJoin("recipes", "reviews.recipe_id", "recipes.id")
      .innerJoin("users", "reviews.user_id", "users.id")
      .where("recipes.id", recipeid)
      .whereNot("reviews.user_id", userid)
      .orderBy("reviews.created_at");

    if (userid) {
      query.whereNot("reviews.user_id", userid);
    }
    return query
      .then((data) => {
        return data;
      })
      .then(null, function (err) {
        //query fail
        console.log(err);
      });
  }

  listByRecipeID(recipeid) {
    let query = this.knex
      .select(
        "reviews.user_id",
        "reviews.recipe_id",
        "reviews.rating",
        "reviews.comment"
      )
      .from("reviews")
      .innerJoin("recipes", "reviews.recipe_id", "recipes.api_id")
      // .innerJoin("recipes", "reviews.recipe_id", "recipes.id")
      .where("recipes.id", recipeid)
      .orderBy("reviews.created_at");
    return query
      .then((data) => {
        return data;
      })
      .then(null, function (err) {
        //query fail
        console.log(err);
      });
  }

  add(recipeid, userid, comment, rating) {
    if (userid) {
      console.log(recipeid, userid, comment, rating);

      // return this.knex("test").insert({ name: "Attempt" });
      return this.knex
        .insert({
          user_id: userid,
          recipe_id: recipeid,
          rating: rating,
          comment: comment,
        })
        .into("reviews");
    } else {
      throw new Error("You must be logged in to post a comment");
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
}

module.exports = reviewService;
