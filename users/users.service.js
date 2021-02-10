const request = require('../common/request');
const { reqFilter, fieldsFilter } = require('../common/common.funtions');

module.exports = {
  getAllUsers: async (query = {}) => {
    const users = await request.get('/users');

    return reqFilter(users, query);
  },
  getSingleUser: async (id, query = {}) => {
    const user = await request.get(`/users/${id}`);
    const { fields } = query || {};

    if (Object.keys(user).length === 0) {
      return null;
    }
    return fieldsFilter(user, fields);
  },
  getUsersById: async (ids) => {
    const users = await request.get('/users');

    return users.filter((user) => ids.includes(user.id));
  },
  postUser: async (body) => {
    const { username, email } = body;

    if (!username) {
      return null;
    }
    if (!email) {
      return null;
    }
    return request.post('/users', body);
  },
  putUser: async (id, body) => request.put(`/users/${id}`, body),
  deleteUser: async (id) => request.delete(`/posts/${id}`),
};
