require("dotenv").config();

//express
const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
const passportFunctions = require("./passport/passport.js");
const passport = require("passport");
const expressSession = require("express-session");
const fs = require("fs");
const https = require("https");

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

//Review route
const recipeRouter = require("./routers/recipeRouter")(express);
app.use("/recipe", recipeRouter);

//Category route
const categoryRouter = require("./routers/categoryRouter")(express);
// app.use("/category", categoryRouter);

// temporary, may change the actual routing
// recipe page?
// const recipeServiceTmp = require("./services/recipeServiceTmp");
// const recipeRouterTmp = require("./routers/recipeRouterTmp");
// const RecipeServiceTmp = new recipeServiceTmp(knex);
// const RecipeRouterTmp = new recipeRouterTmp(RecipeServiceTmp);
// app.use("/recipes", RecipeRouterTmp.router());

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

// temporary, may change the actual routing
// recipe page?
const ingredientServiceTmp = require("./services/ingredientServiceTmp");
const ingredientRouterTmp = require("./routers/ingredientRouterTmp");
const recipeServiceTmp = require("./services/recipeServiceTmp");
const recipeRouterTmp = require("./routers/recipeRouterTmp");

const IngredientServiceTmp = new ingredientServiceTmp(knex);
const IngredientRouterTmp = new ingredientRouterTmp(IngredientServiceTmp);
const RecipeServiceTmp = new recipeServiceTmp(knex);
const RecipeRouterTmp = new recipeRouterTmp(RecipeServiceTmp, IngredientServiceTmp);
app.use("/recipes", RecipeRouterTmp.router());
app.use("/testinginsert", (request, response) => { response.render("insertrecipesTmp"); });
app.use("/ingredients", IngredientRouterTmp.router());




app.listen(4000, () => {
  console.log("App running on 4000");
});

// const options = {
//   cert: fs.readFileSync("./localhost.crt"),
//   key: fs.readFileSync("./localhost.key"),
// };

// https.createServer(options, app).listen(4000);
