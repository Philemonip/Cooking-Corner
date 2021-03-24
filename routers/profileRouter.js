"use strict";

// const { app } = require("../app");

module.exports = (express) => {
  const router = express.Router();
  const multer = require("multer");
  const fs = require("fs");

  // Knex Setup
  const knexConfig = require("../knexfile")["development"];
  const knex = require("knex")(knexConfig);

  const ProfileService = require("../services/profileService");
  const profileService = new ProfileService(knex);

  //Check if the user is authenticated
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }

  router.get("/:userid", function (req, res) {
    let screenshot1, screenshot2, profile;
    fs.promises
      .readdir("./uploads/profiles")
      .then((data) => {
        profile = data.find((file) => file == `${req.params.userid}.jpg`);
        if (profile === undefined) {
          profile = `profileplaceholder.jpg`;
        }
      })
      .catch((error) => {
        console.log(error);
      });

    let validateScreenshot = fs.promises
      .readdir("./uploads/screenshot")
      .then((data) => {
        screenshot1 = data.find((file) => file == `${req.params.userid}_0.jpg`);
        screenshot2 = data.find((file) => file == `${req.params.userid}_1.jpg`);
        if (screenshot1 === undefined) {
          screenshot1 = `screenshotplaceholder.jpg`;
        }
        if (screenshot2 === undefined) {
          screenshot2 = `screenshotplaceholder.jpg`;
        }
      })
      .catch((error) => {
        console.log(error);
      });

    validateScreenshot.then((data) => {
      console.log();
    });

    return profileService
      .getdata(req.params.userid)
      .then((data) => {
        // res.send("hello kim")
        res.render("profile", {
          profile: profile,
          screenshot1: screenshot1,
          screenshot2: screenshot2,
          userid: data[0].id,
          fav_movie: data[0].fav_movie,
          fav_genre: data[0].fav_genre,
          intro: data[0].intro,
        });
      })
      .catch((err) => res.status(500).json(err));
  });

  router.get("/edit/:userid", (req, res) => {
    res.render("profileedit", {
      userid: 1, //TODO
    });
  });

  router.put("/edit/:userid", (req, res) => {
    console.log("edit user put params");
    return profileService
      .add(
        req.params.userid,
        req.body.fav_movie,
        req.body["fav_genre[]"],
        req.body.intro
      )
      .then(() => {
        console.log("done");
        res.send("haha put edit profile");
        // res.redirect(303, "/");
      })
      .catch((err) => res.status(500).json(err));
  });

  router.post("/upload", function (req, res) {
    profileupload(req, res, function (err) {
      if (err) {
        return err;
      }
    });
  });

  router.post("/upload1", function (req, res) {
    screenshotupload(req, res, function (err) {
      if (err) {
        return err;
      }
    });
  });

  //Multer Configs
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname == "profileimageupload") {
        cb(null, "uploads/profiles/");
      } else {
        cb(null, "uploads/screenshot/");
      }
    },
    filename: function (req, file, cb) {
      if (file.fieldname == "profileimageupload") {
        cb(null, "1" + ".jpg");
      } else {
        for (let i = 0; i < req.files.screenshot.length; i++) {
          cb(null, "1" + "_" + i + ".jpg");
        }
      }
    },
  });

  var profileupload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
  }).single("profileimageupload");

  var screenshotupload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
  }).fields([{ name: "screenshot", maxCount: 2 }]);

  return router;
};
