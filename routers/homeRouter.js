"use strict";

module.exports = (express) => {
  const router = express.Router();
  const axios = require("axios");
  const { isLoggedIn } = require("./loginRouter");

  const knexConfig = require("../knexfile")["development"];
  const knex = require("knex")(knexConfig);

  const HomeService = require("../services/homeService");
  const homeService = new HomeService(knex);

  router.route("/").get(topRecipes);
  //   router.route("/:query").get(getTopTenQuery);


  function topRecipes(req, res) {
    console.log('req', req)
    return homeService
      .getTopRecipes()
      .then((info) => {

        // console.log("top", info);
        // console.log(info[0].title);
        res.render("home", {
          //   title: info.title,
          //   score: info.rating,
          //   image: info.image_path,
          info: info,

        });
      })
      .catch((err) => res.status(500).json(err));
  }
  return router;
};

//         res.render("recipes", {
//             //           api_id: data.id,
//             //           title: data.title,
//             //           summary: data.summary,
//             //           author: data.sourceName,
//             //           preparation_time: data.readyInMinutes,
//             //           image_path: data.image,
//             //           instructions: finalInstructions,
//             //           servings: data.servings,

//     }
// }
// console.log(topRecipes)

//   function indexCarousel(req, res) {
//     function getRandom() {
//       return axios
//         .get(
//           `https://api.themoviedb.org/3/discover/movie?api_key=f22e6ce68f5e5002e71c20bcba477e7d&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=true&page=1`
//         )
//         .then((info) => {
//           console.log(info.data.results[0].title);
//           console.log("1");
//           // console.log(info.data.results[0]);
//           return info;
//         })
//         .catch((err) => res.status(500).json(err));
//     }

//     function getNowPlaying(req, res) {
//       return axios
//         .get(
//           `https://api.themoviedb.org/3/movie/now_playing?api_key=f22e6ce68f5e5002e71c20bcba477e7d&language=en-US&page=1`
//         )
//         .then((info) => {
//           // res.send("hello from searchRouter");
//           console.log(info.data.results[1].title);
//           console.log("2");
//           return info;
//         })
//         .catch((err) => res.status(500).json(err));
//     }

//     function getUpComing(req, res) {
//       return axios
//         .get(
//           `https://api.themoviedb.org/3/movie/upcoming?api_key=f22e6ce68f5e5002e71c20bcba477e7d&language=en-US&page=1`
//         )
//         .then((info) => {
//           console.log(info.data.results[2].title);
//           console.log("3");
//           return info;
//         })
//         .catch((err) => res.status(500).json(err));
//     }
//     Promise.all([getTopTen(), getNowPlaying(), getUpComing()])
//       .then(function (results) {
//         const top = results[0].data.results;
//         const nowPlaying = results[1].data.results;
//         const upComing = results[2].data.results;

//         res.render("index", {
//           getTop: top,
//           getNow: nowPlaying,
//           getUp: upComing,
//         });
//       })
//       .catch((err) => res.status(500).json(err));
//   }
//   return router;
// };
