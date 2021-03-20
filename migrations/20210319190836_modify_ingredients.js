
exports.up = function (knex) {
    return knex.schema.table("recipes_ingredients", (table) => {
        table.dropColumn("quantity");
    }).then(() => {
        return knex.schema.table("recipes_ingredients", (table) => {
            table.float("quantity");
            table.varchar("unit");
        })
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable("recipes_ingredients")
};
