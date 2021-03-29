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

const recipeRouter = require("./routers/recipeRouter");
const categoryRouter = require("./routers/categoryRouter");
const loginRouter = require("./routers/loginRouter")(express);
const homeRouter = require("./routers/homeRouter")(express);
const bookmarkRouter = require("./routers/bookmarkRouter")(express);
const uploadRouter = require("./routers/uploadRouter")(express);

//handlebars
app.engine(
  "handlebars",
  handlebars({
    defaultLayout: "main",
    helpers: require("./config/handlebars-helper"),
  })
);
app.set("view engine", "handlebars");

//static files
app.use(express.static("public"));
app.use(express.static("uploads"));

//bcrypt
const bcrypt = require("bcrypt");

//Cookie-session
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

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
app.use("/", loginRouter);
// const passportFunctions = require("./passport");

/////////////////////////////////////////////
// //Review route
// const recipeRouter = require("./routers/recipeRouter")(express);
// app.use("/recipe", recipeRouter);
/////////////////////////////////////////////////
const ingredientService = require("./services/ingredientService");
const recipeService = require("./services/recipeService");
const reviewService = require("./services/reviewService");
const categoryService = require("./services/categoryService");

const IngredientService = new ingredientService(knex);
const RecipeService = new recipeService(knex);
const ReviewService = new reviewService(knex);
const CategoryService = new categoryService(knex);

const RecipeRouter = new recipeRouter(
  RecipeService,
  IngredientService,
  ReviewService,
  CategoryService
);
const CategoryRouter = new categoryRouter(
  RecipeService,
  IngredientService,
  ReviewService,
  CategoryService
);

//Routers for app.use
app.use("/recipe", RecipeRouter.router());
app.use("/category", CategoryRouter.router());
app.use("/", homeRouter);
app.use("/bookmark", bookmarkRouter);
app.use("/upload", uploadRouter);

app.listen(4000, () => {
  console.log("App running on 4000");
});

//FACEBOOK LOGIN HTTPS
// const options = {
//   cert: fs.readFileSync("./localhost.crt"),
//   key: fs.readFileSync("./localhost.key"),
// };

// https.createServer(options, app).listen(4000);

module.exports.app = app;
