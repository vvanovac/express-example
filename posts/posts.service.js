const request = require('../common/request')
const { reqFilter } = require("../common/common.funtions");

module.exports = {
    getAllPosts: async (query) => {
        const posts = await request.get(`/posts`);

        return reqFilter(posts, query);
    },
    getSinglePost: async (id) => {
        const post = await request.get(`/posts/${id}`);

        if (Object.keys(post).length === 0) {
            return null;
        }
        return post;
    },
    postPost: async (body) => {
        return await request.post(`/posts`, body);
    },
    putPost: async (id, body) => {
        return await request.put(`/posts/${id}`, body);
    },
    deletePost: async (id) => {
        return await request.delete(`/posts/${id}`);
    }
}
