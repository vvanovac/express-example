const jwt = require('jsonwebtoken');
const fs = require('fs');

const { hash } = require('../common/constants');
const requirePath = require('../common/path');
const users = require('../data/users.json');

module.exports = {
  loginUser: ({ username, password }) => {
    const validUser = users.find((user) => user.username === username && user.password === password);
    if (!validUser) {
      throw new Error('Login failed. Invalid Username and/or Password');
    }
    const user = { username };
    return jwt.sign(user, hash, { expiresIn: '1h' });
  },
  verifyToken: (token = '') => jwt.verify(token.split(' ')[1], hash),
  registerUser: async (user) => {
    const {
      username, email, password,
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

    const userExists = users.find((e) => e.username === username || e.email === email);
    if (userExists) {
      throw new Error('User already exists.');
    }
    users.push(user);
    const path = requirePath.choosePath('users');
    fs.writeFileSync(path, JSON.stringify(users));

    return user;
  },
};
