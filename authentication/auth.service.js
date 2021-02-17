const jwt = require('jsonwebtoken');

const { hash } = require('../common/constants');
const LocalService = require('../common/local.service');
const usersData = require('../data/users.json');

module.exports = {
  loginUser: ({ username, password }) => {
    const validUser = usersData.find((exist) => exist.username === username && exist.password === password);

    if (!validUser) {
      throw new Error('Login failed. Invalid Username and/or Password');
    }
    const user = { username };
    return jwt.sign(user, hash, { expiresIn: '1y' });
  },
  verifyToken: (token = '') => jwt.verify(token.split(' ')[1], hash),
  registerUser: async (user) => {
    const users = await new LocalService('users').exec();
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

    const userExists = users.find((exist) => exist.username === username || exist.email === email);
    if (userExists) {
      throw new Error('User already exists.');
    }

    await new LocalService('users').create(user).exec();

    return user;
  },
};
