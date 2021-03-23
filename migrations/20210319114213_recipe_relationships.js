exports.up = function (knex) {
  return knex.schema
    .createTable("recipes_ingredients", (table) => {
      table.integer("recipe_id").unsigned();
      table.foreign("recipe_id").references("recipes.id");
      table.float("quantity");
      table.varchar("unit");
    })
    .then(() => {
      return knex.schema.createTable("recipes_cuisines", (table) => {
        table.integer("recipe_id").unsigned();
        table.foreign("recipe_id").references("recipes.id");
        table.varchar("cuisine_name");
      });
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable("recipes_cuisines")
    .then(() => knex.schema.dropTable("recipes_ingredients"));
};
