const knexConfig = require("../knexfile")["development"];
const knex = require("knex")(knexConfig);

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
            .innerJoin("recipes", "reviews.recipe_id", "recipes.id")
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
            .innerJoin("recipes", "reviews.recipe_id", "recipes.id")
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
}

module.exports = reviewService;