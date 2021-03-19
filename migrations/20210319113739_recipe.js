exports.up = function (knex) {
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
};

exports.down = function (knex) {
  return knex.schema.dropTable("recipes");
};
