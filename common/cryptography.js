const crypto = require('crypto');

const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
const digest = 'sha256';
const salt = crypto.randomBytes(128).toString('base64');
const encoding = 'hex';
const LENGTH = 64;

module.exports = {
  comparePasswords: (input, salted, match) => new Promise((resolve, reject) => {
    crypto.pbkdf2(input, salted, 10000, LENGTH, digest, (err, hash) => {
      if (err) {
        return reject(err);
      }
      return resolve((hash.toString(encoding) === match));
    });
  }),
  hashPassword: (input) => new Promise((resolve, reject) => {
    crypto.pbkdf2(input, salt, 10000, LENGTH, digest, (err, hash) => {
      if (err) {
        return reject(err);
      }
      return resolve({ hash: hash.toString(encoding), salt });
    });
  }),
  isValidPasswordFormat: (password) => new RegExp(passwordRegex).test(password),
};
