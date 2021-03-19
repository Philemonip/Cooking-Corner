exports.up = function (knex) {
  return knex.schema
    .createTable("recipes_ingredients", (table) => {
      table.increments("id");
      table.integer("recipe_id").unsigned();
      table.foreign("recipe_id").references("recipes.id");
      table.integer("ingredient_id").unsigned();
      table.foreign("ingredient_id").references("ingredients.id");
      table.integer("quantity");
    })
    .then(() => {
      return knex.schema.createTable("recipes_cuisines", (table) => {
        table.increments("id");
        table.integer("recipe_id").unsigned();
        table.foreign("recipe_id").references("recipes.id");
        table.integer("cuisine_id").unsigned();
        table.foreign("cuisine_id").references("cuisines.id");
      });
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable("recipes_cuisines")
    .then(() => knex.schema.dropTable("recipes_ingredients"));
};
