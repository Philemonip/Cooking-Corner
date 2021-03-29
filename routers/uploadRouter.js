"use strict";

module.exports = (express) => {
  const router = express.Router();
  const path = require("path");
  const multer = require("multer");
  const fs = require("fs");
  const axios = require("axios");
  const { isLoggedIn } = require("./loginRouter");

  const knexConfig = require("../knexfile").development;
  const knex = require("knex")(knexConfig);

  const UploadService = require("../services/uploadService");
  const uploadService = new UploadService(knex);

  const RecipeService = require("../services/recipeService");
  const recipeService = new RecipeService(knex);

  // router.route("/uplpoad").post(isLoggedIn, upload)

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },

    filename: function (req, file, cb) {
      cb(null, file.fieldname + path.extname(file.originalname));
    },
  });

  async function getUploadRecipe(user_id) {
    let uploadedRecipeIDArray = await uploadService.getUploadedRecipe(user_id);
    let uploadedRecipeArr = [];
    for (let i = 0; i < uploadedRecipeIDArray.length; i++) {
      let uploadedRecipe = await recipeService.getRecipeById(uploadedRecipeIDArray[i]);
      uploadedRecipeArr.push(uploadedRecipe[0]);
    }
    return uploadedRecipeArr;
  }

  router.route("/upload-recipe").get((req, res) => {
    if (req.isAuthenticated()) {
      let user = req.user;
      getUploadRecipe(user.id)
        .then((data) => {
          res.render("upload", { username: user.username, uploadedRecipeArr: data });
        });
    }
    else {
      console.log("Login required");
    }
  })

  // router.route("upload-recipe-remove").delete((res, req) => {
  //   console.log(res);
  //   console.log("res.param inside remove button: " + res.param);
  //   // let user = req.user;
  //   // let recipe_id = req.
  //   // return uploadService.removeUploadedRecipe
  // })

  router.route("/upload-recipe").post((req, res) => {
    console.log("hi");
    let upload = multer({
      storage: storage,
    }).single("recipeimageupload");

    upload(req, res, function (err) {
      // req.file contains information of uploaded file
      // req.body contains information of text fields, if there were any
      const { filename, mimetype, size } = req.file;
      const filepath = req.file.path;

      console.log(req.file);

      return knex
        .insert({
          image_Path: filepath,
        })
        .into("recipes");
      // .then(() => res.json({ success: true, filename }))
      // .catch((err) =>
      //   res.json({
      //     success: false,
      //     message: "upload failed",
      //     stack: err.stack,
      //   })
      // );
    });

    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.file) {
      return res.send("Please select an image to upload");
    } else if (err instanceof multer.MulterError) {
      return res.send(err);
    } else if (err) {
      return res.send(err);
    }

    // Display uploaded image for user validation

    console.log(req.file.path);
  });
  return router;
};
