exports.up = function (knex) {
  return knex.schema
    .createTable("recipes_ingredients", (table) => {
      table.increments("id");
      table.integer("recipe_id").unsigned();
      table.foreign("recipe_id").references("recipes.id");
      table.text("ingredient_names");
      table.integer("quantity");
    })
    .then(() => {
      return knex.schema.createTable("recipes_cuisines", (table) => {
        table.increments("id");
        table.integer("recipe_id").unsigned();
        table.foreign("recipe_id").references("recipes.id");
        table.varchar("cuisine_types");
      });
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable("recipes_cuisines")
    .then(() => knex.schema.dropTable("recipes_ingredients"));
};
