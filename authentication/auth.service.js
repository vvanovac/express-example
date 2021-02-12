const jwt = require('jsonwebtoken');
const { hash } = require('../common/constants');

// just for this example, hardcoding list of users
const validUsers = [
  { username: 'batman', password: 'batmobile' },
  { username: 'wonderwoman', password: 'wondergal' },
  { username: 'spiderman', password: 'spiderparker' },
  { username: 'superman', password: 'supersuper' },
  { username: 'ironman', password: 'iron19' },
];

module.exports = {
  loginUser: ({ username, password }) => {
    const validUser = validUsers.find((user) => user.username === username && user.password === password);

    if (!validUser) {
      throw new Error('Login failed. Invalid Username and/or Password');
    }

    const user = { username };
    return jwt.sign(user, hash, { expiresIn: '1h' });
  },
  verifyToken: (token = '') => jwt.verify(token.split(' ')[1], hash),
};
