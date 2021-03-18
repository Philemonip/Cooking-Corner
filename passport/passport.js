const passport = require("passport");

require("dotenv").config();

const knex = require("knex")({
  client: "postgresql",
  connection: {
    database: process.env.DATABASE,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
});
const TABLE_NAME = "passport_users";
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  "local-signup",
  new LocalStrategy(async (username, password, done) => {
    console.log("signing up");
    console.log("Email", username);
    console.log("Password", password);
    try {
      let users = await knex("passport_users").where("username", username);
      console.log(users);
      if (users.length > 0) {
        console.log("failure");

        return done(null, false, { message: "User already exists" });
      }
      console.log("checked database");
      let hashedPassword = await hashFunction.hashPassword(password);
      const newUser = {
        username: username,
        password: hashedPassword,
      };
      let userId = await knex(TABLE_NAME).insert(newUser).returning("id");
      console.log("new user");

      console.log(userId);
      newUser.id = userId[0];
      console.log("New user: ", newUser);
      done(null, newUser);
    } catch (error) {
      console.log(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  let users = await knex("passport_users").where({ id: id });
  if (users.length == 0) {
    return done(new Error(`Wrong user id ${id}`));
  }
  let user = users[0];
  return done(null, user);
});
