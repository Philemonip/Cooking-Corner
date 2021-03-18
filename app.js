//express
const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
const passportFunctions = require("./passport/passport.js");
const passport = require("passport");

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

app.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/login",
    failureRedirect: "/error",
  })
);

app.get("/error", (request, response) => {
  response.render("error");
});

app.listen(4000, () => {
  console.log("App running on 4000");
});
