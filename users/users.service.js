const request = require('../common/request');
const LocalService = require('../common/local.service');

module.exports = {
  getAllUsers: async (query = {}) => {
    const {
      sort, skip, limit, fields, ...searchQuery
    } = query;

    return new LocalService('users')
      .find(searchQuery)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(fields)
      .exec();
  },
  getSingleUser: async (id) => {
    const user = await new LocalService('users')
      .findOne(+id)
      .exec();

    if (!user) {
      throw new Error('User Not Found');
    }

    return user;
  },
  getUsersById: async (ids) => {
    const users = await request.get('/users');

    return users.filter((user) => ids.includes(user.id));
  },
  postUser: async (body) => {
    const { username, email } = body;

    if (!username) {
      throw new Error('Bad Request');
    }
    if (!email) {
      throw new Error('Bad Request');
    }

    return new LocalService('users')
      .create(body)
      .exec();
  },
  async putUser(id, body) {
    const user = await new LocalService('users')
      .findOne(+id)
      .exec();

    if (!user) {
      throw new Error('User Not Found');
    }

    return new LocalService('users')
      .update(+id, body)
      .exec();
  },
  async deleteUser(id) {
    const user = await new LocalService('users')
      .findOne(+id)
      .exec();

    if (!user) {
      throw new Error('User Not Found');
    }

    return new LocalService('users')
      .delete(+id)
      .exec();
  },
};
