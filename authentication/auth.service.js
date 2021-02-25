const jwt = require('jsonwebtoken');

const { hash } = require('../common/constants');
const LocalService = require('../common/local.service');
const cryptography = require('../common/cryptography');
const messages = require('../common/message.constants');

module.exports = {
  loginUser: async ({ username, password }) => {
    const [validUser] = await new LocalService('users').find({ username }).exec();

    if (!validUser) {
      throw new Error(messages.LOGIN_FAILED);
    }

    const validPassword = await cryptography.comparePasswords(password, validUser.salt, validUser.hash);
    if (!validPassword) {
      throw new Error(messages.LOGIN_FAILED);
    }

    const user = { username, id: validUser.id };
    return jwt.sign(user, hash, { expiresIn: '1y' });
  },
  verifyToken: (token = '') => jwt.verify(token.split(' ')[1], hash),
  registerUser: async (user) => {
    const {
      id, username, email, password, ...rest
    } = user;

    if (Object.keys(user).length === 0) {
      throw new Error(messages.BAD_REQUEST);
    }
    if (!username) {
      throw new Error(messages.USERNAME_MISSING);
    }
    if (!email) {
      throw new Error(messages.EMAIL_MISSING);
    }
    if (!password) {
      throw new Error(messages.PASSWORD_MISSING);
    }
    if (id) {
      throw new Error(messages.NO_ID);
    }

    const userExists = await new LocalService('users').find({ username, email }).exec();
    if (userExists.length > 0) {
      throw new Error(messages.USER_EXISTS);
    }

    if (!cryptography.isValidPasswordFormat(password)) {
      throw new Error(messages.INCORRECT_PASSWORD_FORMAT);
    }

    const result = await cryptography.hashPassword(password);

    const newUser = { username, email, ...rest };
    return new LocalService('users').create({ ...newUser, ...result });
  },
};
