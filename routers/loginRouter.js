const passport = require('passport');

// Knex Setup
const knexConfig = require("../knexfile").development;
const knex = require("knex")(knexConfig);

// const MovieService = require ("../services/movieService");
// const movieService = new MovieService(knex);

module.exports = (express) => {
  const router = express.Router();

  module.exports.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
    //res.render() {other layouts}
  };

  module.exports.isNotLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect("/login");
    }
    return next();
  };

  //Login page
  router.get("/login", (req, res) => {
    res.render("login", { layout: "signupAndLogin" });
  });

  router.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/",
      failureRedirect: "/error",
    })
  );
  router.get("/bookmark", (req, res) => {
    res.render("bookmark");
  });

  router.get("/myrecipes", (req, res) => {
    res.render("myrecipes");
  });

  router.get(
    "/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  router.get(
    "/google/callback",
    passport.authenticate("google", {
      successRedirect: "/",
      // failureRedirect: "/error",
    })
  );

  router.get(
    "/facebook",
    passport.authenticate("facebook", {
      // scope: ["profile", "email"],
      scope: ["email"],
    })
  );

  router.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
      successRedirect: "/",
      // failureRedirect: "/error",
    })
  );

  //Signup page
  router.get("/signup", (req, res) => {
    res.render("signup", { layout: "signupAndLogin" });
  });

  router.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/login",
      failureRedirect: "/error",
    })
  );

  //Logout redirect
  router.get("/logout", (req, res) => {
    // req.session = null;
    req.logout();
    res.redirect("/");
  });

  //test
  router.get("/upload", (req, res) => {
    res.render("upload");
  });

  router.get('/error', (req, res) => {
    // res.render("You have failed to login!");
    res.render('error')
  });

  return router;
};
