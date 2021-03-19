exports.up = function (knex, Promise) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("id");
      table.varchar("username").unique();
      table.varchar("password");
      table.string("facebook_id");
      table.string("google_id");
      table.binary("profile_pic");
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
    });
};

exports.down = function (knex, Promise) {
  return knex.schema
    .dropTable("cuisines")
    .then(() => knex.schema.dropTable("ingredients"))
    .then(() => knex.schema.dropTable("users"));
};
