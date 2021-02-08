const request = require('../common/request');
const { reqFilter } = require('../common/common.funtions');

module.exports = {
    getAllUsers: async (query) => {
        const users = await request.get(`/users`);

        return reqFilter(users, query);
    },
    getSingleUser: async (id) => {
        const user = await request.get(`/users/${id}`);

        if (Object.keys(user).length === 0) {
            return null;
        }
        return user;
    },
    postUser: async (body) => {
        return await request.post(`/users`, body);
    },
    putUser: async (id, body) => {
        return await request.put(`/users/${id}`, body);
    },
    deleteUser: async (id) => {
        return await request.delete(`/posts/${id}`);
    }
}