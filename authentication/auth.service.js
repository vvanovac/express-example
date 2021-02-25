const jwt = require('jsonwebtoken');

const { hash } = require('../common/constants');
const LocalService = require('../common/local.service');
const cryptography = require('../common/cryptography');

module.exports = {
  loginUser: async ({ username, password }) => {
    const [validUser] = await new LocalService('users').find({ username }).exec();

    if (!validUser) {
      throw new Error('Login failed. Invalid Username and/or Password');
    }

    const validPassword = await cryptography.comparePasswords(password, validUser.salt, validUser.hash);
    if (!validPassword) {
      throw new Error('Login failed. Invalid Username and/or Password');
    }

    const user = { username, id: validUser.id };
    return jwt.sign(user, hash, { expiresIn: '1y' });
  },
  verifyToken: (token = '') => jwt.verify(token.split(' ')[1], hash),
  registerUser: async (user) => {
    await new LocalService('users').exec();
    const {
      id, username, email, password,
    } = user;
    if (Object.keys(user).length === 0) {
      throw new Error('Bad Request');
    }
    if (!username) {
      throw new Error('Please enter username.');
    }
    if (!email) {
      throw new Error('Please enter email.');
    }
    if (!password) {
      throw new Error('Please enter password.');
    }
    if (id) {
      throw new Error('Please do not enter id.');
    }

    const userExists = await new LocalService('users').find({ username, email }).exec();
    if (userExists.length > 0) {
      throw new Error('User already exists.');
    }

    const result = await cryptography.hashPassword(password);

    delete user.password;

    return new LocalService('users').create({ ...user, ...result });
  },
};
