const bcrypt = require("bcrypt");

function hashPassword(plainTextPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt((err, salt) => {
      if (err) {
        reject(err);
      }

      bcrypt.hash(plainTextPassword, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
}

function checkPassword(plainTextPassword, hashedPassword) {
  return new Promise((resolve, reject) => {
    console.log("Check password function");
    bcrypt.compare(plainTextPassword, hashedPassword, (err, match) => {
      if (err) {
        reject(err);
      }
      resolve(match);
    });
  });
}
module.exports = {
  checkPassword: checkPassword,
  hashPassword: hashPassword,
};
