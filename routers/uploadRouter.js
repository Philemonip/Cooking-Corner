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

  // router.route("/uplpoad").post(isLoggedIn, upload)

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },

    filename: function (req, file, cb) {
      cb(null, file.fieldname + path.extname(file.originalname));
    },
  });

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

      return this.knex
        .insert({
          image_Path: filepath,
        })
        .into("recipes")
        .then(() => res.json({ success: true, filename }))
        .catch((err) =>
          res.json({
            success: false,
            message: "upload failed",
            stack: err.stack,
          })
        );
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