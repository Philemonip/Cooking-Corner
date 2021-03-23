exports.up = function (knex) {
  return knex.schema
    .createTable("recipes_ingredients", (table) => {
      table.integer("recipe_api_id").unsigned();
      table.foreign("recipe_api_id").references("recipes.api_id");
      table.float("quantity");
      table.varchar("unit");
    })
    .then(() => {
      return knex.schema.createTable("recipes_cuisines", (table) => {
        table.integer("recipe_api_id").unsigned();
        table.foreign("recipe_api_id").references("recipes.api_id");
        table.varchar("cuisine_name");
      });
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable("recipes_cuisines")
    .then(() => knex.schema.dropTable("recipes_ingredients"));
};
