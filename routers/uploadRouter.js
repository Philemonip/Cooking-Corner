"use strict";

const e = require("express");

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

  // const storage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "uploads");
  //   },

  //   filename: function (req, file, cb) {
  //     cb(null, file.fieldname + path.extname(file.originalname));
  //   },
  // });

  async function getUploadRecipe(user_id) {
    let uploadedRecipeIDArray = await uploadService.getUploadedRecipe(user_id);
    let uploadedRecipeArr = [];
    for (let i = 0; i < uploadedRecipeIDArray.length; i++) {
      let uploadedRecipe = await recipeService.getRecipeById(
        uploadedRecipeIDArray[i]
      );
      uploadedRecipeArr.push(uploadedRecipe[0]);
    }
    return uploadedRecipeArr;
  }

  async function addRecipe(recipe) {
    let recipe_id = await recipeService.addRecipe(recipe);
  }

  async function addUploadRecipe(user_id, recipe_id) {
    let a = await uploadService.addUploadedRecipe(user_id, recipe_id);
  }

  router.route("/upload-recipe").get((req, res) => {
    if (req.isAuthenticated()) {
      let user = req.user;
      getUploadRecipe(user.id).then((data) => {
        let newdata = data.map((x) => {
          // console.log(x);
          if (x.image_path.substring(0, 7) === "uploads") {
            x.image_path = path.join("../" + x.image_path);
            return x;
          } else {
            return x;
          }
        });
        // console.log(newdata);
        res.render("upload", {
          user: req.user,
          username: user.username,
          uploadedRecipeArr: newdata,
        });
      });
    } else {
      res.send("Login required");
    }
  });

  router.route("/upload-recipe-remove/:id").delete(async (req, res) => {
    console.log("Delete upload recipe");
    let deleteUploadRecipe = await uploadService.removeUploadedRecipe(
      req.user.id,
      req.params.id
    );
  });

  // router.route("/upload-recipe").post((req, res) => {
  router.post("/upload-recipe", async (req, res) => {
    let filename = "";
    let fileformat = "";
    let storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "uploads");
      },

      filename: function (req, file, cb) {
        // cb(null, `${req.user.id}_${req.user.username}_${req.body.title}` + path.extname(file.originalname));
        filename = file.fieldname;
        fileformat = path.extname(file.originalname);
        cb(null, file.fieldname + path.extname(file.originalname));
      },
    });

    // console.log("POST of upload-recipe");
    // console.log(`req.body: `);
    // console.log(req.body);

    let upload = multer({
      storage: storage,
    }).single("recipeimageupload");

    upload(req, res, async function (err) {
      // req.file contains information of uploaded file
      // req.body contains information of text fields, if there were any
      const { filename, mimetype, size } = req.file;

      let recipe = {};
      let a = await knex("recipes")
        .min("api_id")
        .then((row) => {
          return row[0]["min"];
        });
      recipe["api_id"] = Math.min(a - 1, 0);
      recipe["title"] = req.body.title;
      recipe["author"] = req.user.username;
      recipe["summary"] = req.body.summary;
      recipe["instructions"] = req.body.instructions;
      recipe["preparation_time"] = req.body.preparation_time;
      recipe[
        "image_path"
      ] = `../${req.user.id}_${req.user.username}_${req.body.title}${fileformat}`;
      recipe["servings"] = req.body.servings;
      recipe["difficulty"] = req.body.difficulty;

      if (!req.file) {
        return res.send("Please select an image to upload");
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      } else {
        // let recipe_id = await addRecipe(recipe);
        let recipe_id = await recipeService.addRecipe(recipe);
        console.log(recipe_id);
        console.log(req.user.id);
        // let b = await addUploadRecipe(req.user.id, recipe_id);
        let b = await uploadService.addUploadedRecipe(req.user.id, recipe_id);

        fs.rename(
          path.join(__dirname, `../uploads/${filename}`),
          path.join(
            __dirname,
            `../uploads/${req.user.id}_${req.user.username}_${req.body.title}${fileformat}`
          ),
          function (err) {
            if (err) console.log("ERROR: " + err);
          }
        );

        getUploadRecipe(req.user.id).then((data) => {
          res.render("upload", {
            user: req.user,
            username: req.user.username,
            uploadedRecipeArr: data,
          });
        });
      }
    });
  });
  return router;
};
