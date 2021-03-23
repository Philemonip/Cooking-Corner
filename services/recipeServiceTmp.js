const knexConfig = require("../knexfile")["development"];
const knex = require("knex")(knexConfig);

// function makeUser(eachUserRow) {
//     return eachUserRow.map((eachRow) => ({
//         id: eachRow.id,
//         username: eachRow.username,
//         password: eachRow.password,
//     }))
// }

class recipeServiceTmp {
  constructor(knex) {
    this.knex = knex;
  }

  getRecipeById(id) {
    return this.knex("recipes")
      .select()
      .where({ id: id })
      .then((row) => {
        return row;
      });
  }

  getRecipeByApiId(api_id) {
    return this.knex("recipes")
      .select()
      .where({ api_id: api_id })
      .then((row) => {
        return row;
      });
  }

  // getUsers() {
  //     return this.knex("class_users")
  //         .select("id", "username", "password")
  //         .then((object) => {
  //             console.log(object);
  //             return makeUser(object);
  //         })
  // }

  // getUser(id) {
  //     return this.knex("class_users")
  //         .select("id", "username", "password")
  //         .where({ id: id }).then((object) => {
  //             console.log(object);
  //             return object
  //         })
  // }

  // postUser(user) {
  //     return this.knex("class_users")
  //         .insert(user)
  //         .then(() => {
  //             console.log("inserted");
  //         })
  // }

  // editUser(id, user) {
  //     return this.knex("class_users")
  //         .where({ id: id })
  //         .update(user)
  //         .then(() => {
  //             console.log("updated");
  //         })
  // }

  // deleteUser(id) {
  //     return this.knex("class_users")
  //         .where({ id: id })
  //         .del()
  //         .then(() => {
  //             console.log("deleted");
  //         })
  // }
}

// let service = new UserService(knex);

// service.getUsers()
// service.getUser(1);
// let user = {
//     username: "rachel",
//     password: "newpassword",
// }
// service.postUser(user);
// service.editUser(5, user);
// service.deleteUser(5);

module.exports = recipeServiceTmp;
