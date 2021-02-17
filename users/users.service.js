const request = require('../common/request');
// const { reqFilter, fieldsFilter } = require('../common/common.funtions');
const LocalService = require('../common/local.service');

module.exports = {
  getAllUsers: async (query = {}) => new LocalService('users').find(query).exec(),
  // const users = await request.get('/users');
  // return reqFilter(users, query);
  getSingleUser: async (id) => new LocalService('users').findOne(+id).exec(),

  // const user = await request.get(`/users/${id}`);
  // const { fields } = query || {};
  //
  // if (Object.keys(user).length === 0) {
  //   throw new Error('User Not Found');
  // }
  // return fieldsFilter(user, fields);

  getUsersById: async (ids) => {
    const users = await request.get('/users');

    return users.filter((user) => ids.includes(user.id));
  },
  postUser: async (body) => new LocalService('users').create(body).exec(),
  // const { username, email } = body;
  //
  // if (!username) {
  //   throw new Error('Bad Request');
  // }
  // if (!email) {
  //   throw new Error('Bad Request');
  // }
  // return request.post('/users', body);

  async putUser(id, body) {
    // const user = await this.getSingleUser(id);
    //
    // if (!user) {
    //   throw new Error('User Not Found');
    // }
    // return request.put(`/users/${id}`, body);

    return new LocalService('users').update(+id, body).exec();
  },
  async deleteUser(id) {
    // const user = this.getSingleUser(id);
    //
    // if (!user) {
    //   throw new Error('User Not Found');
    // }
    // return request.delete(`/users/${id}`);

    return new LocalService('users').delete(+id).exec();
  },
};
