const LocalService = require('../common/local.service');
const cryptography = require('../common/cryptography');

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

    users.find((user) => {
      delete user.hash;
      delete user.salt;
    });

    return users;
  },
  getSingleUser: async (id) => {
    const user = await new LocalService('users')
      .findOne(+id)
      .exec();

    if (!user) {
      throw new Error('User Not Found');
    }

    delete user.hash;
    delete user.salt;

    return user;
  },
  getUsersById: async (ids) => {
    const users = await new LocalService('users')
      .find()
      .exec();

    return users.filter((user) => ids.includes(user.id));
  },
  postUser: async (body) => {
    const { username, email, password } = body;

    if (!username) {
      throw new Error('Bad Request');
    }
    if (!email) {
      throw new Error('Bad Request');
    }
    if (!password) {
      throw new Error('Bad Request');
    }

    const userExists = await new LocalService('users').find({ username, email }).exec();
    if (userExists.length > 0) {
      throw new Error('User already exists.');
    }

    if (!cryptography.isValidPasswordFormat(password)) {
      // eslint-disable-next-line max-len
      throw new Error('Your password must contain at least 1 uppercase and 1 lowercase character, 1 number and be at least 8 characters long');
    }

    const result = await cryptography.hashPassword(password);

    delete body.password;

    await new LocalService('users')
      .create({ ...body, ...result });

    return body;
  },
  putUser: async (id, body) => {
    const { oldPassword, newPassword } = body;

    const user = await new LocalService('users')
      .findOne(+id)
      .exec();

    if (!user) {
      throw new Error('User Not Found');
    }

    if (oldPassword && newPassword) {
      const compare = await cryptography.comparePasswords(oldPassword, user.salt, user.hash);

      if (!compare) {
        throw new Error('Old password is incorrect.');
      }

      if (compare) {
        const isNewPasswordValid = cryptography.isValidPasswordFormat(newPassword);

        if (!isNewPasswordValid) {
          // eslint-disable-next-line max-len
          throw new Error('Your new password must contain at least 1 uppercase and 1 lowercase character, 1 number and be at least 8 characters long');
        }

        const { hash, salt } = await cryptography.hashPassword(newPassword);

        body.hash = hash;
        body.salt = salt;
      }
    }

    delete body.oldPassword;
    delete body.newPassword;

    return new LocalService('users')
      .update(+id, body);

    // return body;
  },
  deleteUser: async (id) => {
    const user = await new LocalService('users')
      .findOne(+id)
      .exec();

    if (!user) {
      throw new Error('User Not Found');
    }

    await new LocalService('users')
      .delete(+id);

    delete user.hash;
    delete user.salt;

    return user;
  },
};
