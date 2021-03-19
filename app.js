//express
const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
const passportFunctions = require("./passport/passport.js");
const passport = require("passport");
const expressSession = require("express-session");

//body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//handlebars
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//static files
app.use(express.static("public"));

//bcrypt
const bcrypt = require("bcrypt");

//Cookie-session
app.use(
  expressSession({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(req.cookies);
    console.log(req.session.passport.user, "passport USER");
    console.log(req.user, "USER");
    return next();
  }

  res.redirect("/login");
};

//knex
// const knex = require('./knexfile')
require("dotenv").config();
const knex = require("knex")({
  client: "postgresql",
  connection: {
    database: process.env.DATABASE,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
});

// //Two Default methods that need to be called to implement passport
app.use(passport.initialize());
app.use(passport.session());
// const passportFunctions = require("./passport");

// app.get;
app.get("/", (req, res) => {
  res.render("login");
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/home",
    // failureRedirect: "/error",
  })
);

app.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/home",
    // failureRedirect: "/error",
  })
);

app.get("/home", isLoggedIn, (req, res) => {
  res.render("home");
});

app.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/login",
    // failureRedirect: "/error",
  })
);

app.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/home",
    // failureRedirect: "/error",
  })
);

app.get("/error", (request, response) => {
  res.send("You have failed to login");
});

app.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/login");
});

app.listen(4000, () => {
  console.log("App running on 4000");
});
