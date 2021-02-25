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

    if (user.hash || user.salt) {
      delete user.hash;
      delete user.salt;
    }

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

    const userExists = await new LocalService('users').find({ username, email }).exec();
    if (userExists.length > 0) {
      throw new Error('User already exists.');
    }

    const result = await cryptography.hashPassword(password);

    delete body.password;

    await new LocalService('users')
      .create({ ...body, ...result });

    return body;
  },
  putUser: async (id, body) => {
    const user = await new LocalService('users')
      .findOne(+id)
      .exec();

    if (!user) {
      throw new Error('User Not Found');
    }

    if (body.password) {
      console.log('contains password');
    }

    return new LocalService('users')
      .update(+id, body);
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
