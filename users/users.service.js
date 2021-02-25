const LocalService = require('../common/local.service');
const cryptography = require('../common/cryptography');
const messages = require('../common/message.constants');

module.exports = {
  getAllUsers: async (query = {}) => {
    const {
      sort, skip, limit, fields, ...searchQuery
    } = query;

    const users = await new LocalService('users')
      .find(searchQuery)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(fields)
      // .join('address', 'id', 'address' )
      .exec();

    return users.map(({ hash, salt, ...rest }) => rest);
  },
  getSingleUser: async (id) => {
    const user = await new LocalService('users')
      .findOne(+id)
      .exec();

    if (!user) {
      throw new Error(messages.USER_NOT_FOUND);
    }

    const { hash, salt, ...rest } = user;

    return rest;
  },
  getUsersById: async (ids) => {
    const users = await new LocalService('users')
      .find()
      .exec();

    return users.filter((user) => ids.includes(user.id));
  },
  postUser: async (body) => {
    const {
      username, email, password, ...rest
    } = body;

    if (!username) {
      throw new Error(messages.USERNAME_MISSING);
    }
    if (!email) {
      throw new Error(messages.EMAIL_MISSING);
    }
    if (!password) {
      throw new Error(messages.PASSWORD_MISSING);
    }

    const userExists = await new LocalService('users').find({ username, email }).exec();
    if (userExists.length > 0) {
      throw new Error(messages.USER_EXISTS);
    }

    if (!cryptography.isValidPasswordFormat(password)) {
      throw new Error(messages.INCORRECT_PASSWORD_FORMAT);
    }

    const result = await cryptography.hashPassword(password);

    await new LocalService('users')
      .create({
        username, email, ...rest, ...result,
      });

    return { username, email, ...rest };
  },
  putUser: async (id, body) => {
    const { oldPassword, newPassword, ...rest } = body;

    const user = await new LocalService('users')
      .findOne(+id)
      .exec();

    if (!user) {
      throw new Error(messages.USER_NOT_FOUND);
    }

    if (oldPassword && newPassword) {
      const compare = await cryptography.comparePasswords(oldPassword, user.salt, user.hash);

      if (!compare) {
        throw new Error(messages.INCORRECT_OLD_PASSWORD);
      }

      if (compare) {
        const isNewPasswordValid = cryptography.isValidPasswordFormat(newPassword);

        if (!isNewPasswordValid) {
          throw new Error(messages.INCORRECT_PASSWORD_FORMAT);
        }

        const { hash, salt } = await cryptography.hashPassword(newPassword);

        //  eslint-disable-next-line no-param-reassign
        body.hash = hash;
        //  eslint-disable-next-line no-param-reassign
        body.salt = salt;
      }
    }

    return new LocalService('users')
      .update(+id, { ...rest });
  },
  deleteUser: async (id) => {
    const user = await new LocalService('users')
      .findOne(+id)
      .exec();

    if (!user) {
      throw new Error(messages.USER_NOT_FOUND);
    }

    await new LocalService('users')
      .delete(+id);

    const { hash, salt, ...rest } = user;

    return rest;
  },
};
