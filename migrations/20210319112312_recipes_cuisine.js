
exports.up = function (knex) {
    return knex.schema.table("recipes", (table) => {
        table.dropForeign("cuisine_id");
    }).then(() => {
        return knex.schema.table("recipes", (table) => {
            table.dropColumn("cuisine_id");
        })
    }).then(() => {
        return knex.schema.createTable("recipes_cuisines", (table) => {
            table.integer("recipe_id").unsigned();
            table.foreign("recipe_id").references("recipes.id");
            table.varchar("cuisine_name")
        })
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable("recipes_cuisines")
};
