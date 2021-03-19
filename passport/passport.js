const passport = require("passport");
const hashFunction = require("./bcrypt.js");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

require("dotenv").config();

const knex = require("knex")({
  client: "postgresql",
  connection: {
    database: process.env.DATABASE,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
});
const TABLE_NAME = "users";
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  let users = await knex(TABLE_NAME).where({ id: id });
  if (users.length == 0) {
    return done(new Error(`Wrong user id ${id}`));
  }
  let user = users[0];
  return done(null, user);
});

// Sign-Up
passport.use(
  "local-signup",
  new LocalStrategy(async (username, password, done) => {
    console.log("signing up");
    console.log("Email", username);
    console.log("Password", password);
    try {
      let users = await knex(TABLE_NAME).where("username", username);
      console.log(users);
      if (users.length > 0) {
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
      return done(null, newUser);
    } catch (error) {
      console.log(error);
    }
  })
);

//Login

passport.use(
  "local-login",
  new LocalStrategy(async (username, password, done) => {
    console.log("logging in");
    console.log("Email", username);
    console.log("Password", password);
    try {
      let users = await knex(TABLE_NAME).where("username", username);
      console.log(users);
      if (users.length == 0) {
        return done(null, false, { message: "Wrong username." });
      }
      console.log("checked database");
      let user = users[0];

      console.log("User", user);
      console.log("User password", user.password);

      let result = await hashFunction.checkPassword(password, user.password);
      console.log("Does the check password function work here?", result);

      if (result) {
        return done(null, user);
      } else {
        return done(null, false, { message: "incorrect credentials" });
      }
    } catch (error) {
      done(error);
    }
  })
);

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FB_APP_ID,
//       clientSecret: process.env.FB_APP_SECRET,
//       callbackURL: "http://localhost:4000/facebook/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       console.log("profile", profile);
//       use the profile info (profile id) to check if the user is registered in your db
//       let userResult = await knex(TABLE_NAME).where("google_id", profile.id);
//       if (userResult == 0) {
//         const user = {
//           google_id: profile.id,
//           username: profile.emails[0].value,
//           profile_pic: profile.photos[0].value,
//         };
//         let userId = await knex(TABLE_NAME).insert(user).returning("id");
//         console.log("new user logged in through google");
//         console.log(userId);
//         user.id = userId[0];
//         console.log("New google user: ", user);
//         return done(null, user);
//       } else {
//         done(null, userResult[0]);
//       }
//     }
//   )
// );

// Google Strategy
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("profile", profile);
      // use the profile info (profile id) to check if the user is registered in your db
      let userResult = await knex(TABLE_NAME).where("google_id", profile.id);
      if (userResult == 0) {
        const user = {
          google_id: profile.id,
          username: profile.emails[0].value,
          profile_pic: profile.photos[0].value,
        };
        let userId = await knex(TABLE_NAME).insert(user).returning("id");
        console.log("new user logged in through google");
        console.log(userId);
        user.id = userId[0];
        console.log("New google user: ", user);
        return done(null, user);
      } else {
        done(null, userResult[0]);
      }
    }
  )
);
