const passport = require("passport");

// Knex Setup
const knexConfig = require("../knexfile").development;
const knex = require("knex")(knexConfig);

module.exports = (express) => {
  const router = express.Router();

  //Check if the user is authenticated
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }

  //Get user id to render on index
  // function getUserName(userid) {
  //   return knex("usertable")
  //     .select("id", "username")
  //     .where("id", userid)
  //     .orderBy("id")
  //     .then((data) => {
  //       userName = data[0].username;
  //       return data[0].username;
  //     })
  //     .catch((err) => console.error(err));
  // }

  // Serve Main page
  // router.get("/", function (req, res) {
  //   // router.get("/", isLoggedIn, function (req, res) {
  //   console.log("GET MAIN");
  //   // getUserName(req.session.passport.user)
  //   //   .then(() => noteService.list(req.session.passport.user))
  //   // .then((noteArr) => {
  //   res.render("index");
  //   // {
  //   //     currentuser: "Julie",
  //   //     array: noteArr,
  //   //   });
  //   // })
  //   // .catch((err) => res.status(500).json(err));
  // });

  //Login page

  router.get("/", (req, res) => {
    res.render("login");
  });

  router.get("/login", (req, res) => {
    res.render("login");
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
      successRedirect: "/home",
      // failureRedirect: "/error",
    })
  );

  router.get(
    "/facebook",
    passport.authenticate("facebook", {
      scope: ["profile", "email"],
    })
  );

  router.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
      successRedirect: "/home",
      // failureRedirect: "/error",
    })
  );

  router.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/home",
      failureRedirect: "/error",
    })
  );

  //Signup page
  router.get("/signup", (req, res) => {
    res.render("signup");
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
    req.session = null;
    req.logout();
    res.redirect("/login");
  });

  router.get("/error", (req, res) => {
    res.send("You have failed to login!");
  });

  return router;
};
