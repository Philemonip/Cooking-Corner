exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex("passport_users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("passport_users").insert([
        {
          username: "david@david.com",
          password: "david",
        },
      ]);
    });
};
