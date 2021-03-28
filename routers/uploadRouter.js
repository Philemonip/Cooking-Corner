"use strict";

module.exports = (express) => {
  const router = express.Router();
  const multer = require("multer");
  const fs = require("fs");
  const axios = require("axios");
  const { isLoggedIn } = require("./loginRouter");

  const knexConfig = require("../knexfile").development;
  const knex = require("knex")(knexConfig);

  const UploadService = require("../services/uploadService");
  const uploadService = new UploadService(knex);
};
