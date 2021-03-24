
exports.up = function(knex) {
    return knex.schema.table("recipes_ingredients", (table) => {
        table.dropForeign("recipe_id");
    }).then(() => {
        return knex.schema.table("recipes_ingredients", (table) => {
            table.foreign("recipe_id").references("recipes.id");
        })
    }).then(() => {
        return knex.schema.table("recipes", (table) => {
            table.dropUnique("api_id");
        })
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("recipes_ingredients");
};
