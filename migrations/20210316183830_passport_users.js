exports.up = function (knex, Promise) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("id");
      table.varchar("username").unique();
      table.varchar("password");
      table.timestamps(true, true);
      table.boolean("active");
    })
    .then(() => {
      return knex.schema.createTable("ingredients", (table) => {
        table.increments("id");
        table.varchar("ingredient_name");
      });
    })
    .then(() => {
      return knex.schema.createTable("cuisines", (table) => {
        table.increments("id");
        table.varchar("cuisine_name");
      });
    })
    .then(() => {
      return knex.schema.createTable("recipes", (table) => {
        table.increments("id");
        table.integer("api_id").unique();
        table.varchar("title");
        table.varchar("author");
        table.text("summary");
        table.text("instructions");
        table.integer("preparation_time");
        table.varchar("image_path");
        table.varchar("servings");
        table.varchar("difficulty");
        table.integer("cuisine_id").unsigned();
        table.foreign("cuisine_id").references("cuisines.id");
        table.timestamps(true, true);
      });
    })
    .then(() => {
      return knex.schema.createTable("recipes_ingredients", (table) => {
        table.integer("recipe_id").unsigned();
        table.foreign("recipe_id").references("recipes.id");
        table.integer("ingredient_id").unsigned();
        table.foreign("ingredient_id").references("ingredients.id");
        table.integer("quantity");
      });
    })
    .then(() => {
      return knex.schema.createTable("reviews", (table) => {
        table.increments("id");
        table.integer("user_id").unsigned();
        table.foreign("user_id").references("users.id");
        table.integer("recipe_id").unsigned();
        table.foreign("recipe_id").references("recipes.id");
        table.integer("rating");
        table.text("comment");
        table.timestamps(true, true);
      });
    })
    .then(() => {
      return knex.schema.createTable("users_favourite_recipe", (table) => {
        table.integer("user_id").unsigned();
        table.foreign("user_id").references("users.id");
        table.integer("recipe_id").unsigned();
        table.foreign("recipe_id").references("recipes.id");
      });
    })
    .then(() => {
      return knex.schema.createTable("users_uploaded_recipe", (table) => {
        table.integer("user_id").unsigned();
        table.foreign("user_id").references("users.id");
        table.integer("recipe_id").unsigned();
        table.foreign("recipe_id").references("recipes.id");
      });
    });
};

exports.down = function (knex, Promise) {
  return knex.schema
    .dropTable("users")
    .then(() => knex.schema.dropTable("ingredients"))
    .then(() => knex.schema.dropTable("cuisines"))
    .then(() => knex.schema.dropTable("recipes"))
    .then(() => knex.schema.dropTable("recipes_ingredients"))
    .then(() => knex.schema.dropTable("reviews"))
    .then(() => knex.schema.dropTable("users_favourite_recipe"))
    .then(() => knex.schema.dropTable("users_uploaded_recipe"));
};
