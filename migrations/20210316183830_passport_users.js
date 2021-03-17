exports.up = function (knex, Promise) {
  return knex.schema.createTable("passport_users", (table) => {
    table.increments().primary();
    table.string("username");
    table.string("password");
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable("passport_users");
};
