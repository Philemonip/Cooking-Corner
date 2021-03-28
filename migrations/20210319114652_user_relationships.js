exports.up = function (knex) {
  return knex.schema
    .createTable("users_favourite_recipes", (table) => {
      table.increments("id");
      table.integer("user_id").unsigned();
      table.foreign("user_id").references("users.id");
      table.integer("recipe_id").unsigned();
      table.foreign("recipe_id").references("recipes.api_id");
    })
    .then(() => {
      return knex.schema.createTable("users_uploaded_recipes", (table) => {
        table.increments("id");
        table.integer("user_id").unsigned();
        table.foreign("user_id").references("users.id");
        table.integer("recipe_id").unsigned();
        table.foreign("recipe_id").references("recipes.id");
      });
    })
    .then(() => {
      return knex.schema.createTable("reviews", (table) => {
        table.increments("id");
        table.integer("user_id").unsigned();
        table.foreign("user_id").references("users.id");
        table.integer("recipe_id").unsigned();
        table.foreign("recipe_id").references("recipes.api_id");
        table.integer("rating");
        table.text("comment");
        table.timestamps(true, true);
      });
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable("reviews")
    .then(() => knex.schema.dropTable("users_uploaded_recipes"))
    .then(() => knex.schema.dropTable("users_favourite_recipes"));
};
