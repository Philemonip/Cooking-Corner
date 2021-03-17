const passport = require("passport");

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
      let users = await knex(TABLE_NAME).where("username", username);
      if (users.length > 0) {
        return done(null, false, { message: "User already exists" });
      }
      const newUser = {
        username: username,
        password: password,
      };
      let userId = await knex(TABLE_NAME).insert(newUser).returning("id");
      console.log(userId);
      newUser.id = userId[0];
      console.log("New user: ", newUser);
      done(null, newUser);
    } catch (error) {
      console.log(error);
    }
  })
);
