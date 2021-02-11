const request = require('../common/request');
const { reqFilter, fieldsFilter } = require('../common/common.funtions');
const userService = require('../users/users.service');

module.exports = {
  getAllPosts: async (query) => {
    const posts = await request.get('/posts');

    const userIds = posts.map((post) => post.userId);
    const userIdsUnique = userIds.filter((id, index) => userIds.indexOf(id) === index);
    const someUsers = await userService.getUsersById(userIdsUnique);

    return reqFilter(posts, query).map((post) => {
      const { userId, ...restOfPosts } = post;

      if (userId) {
        const user = someUsers.find((u) => userId === u.id);

        if (user) {
          restOfPosts.user = user;
        }
      }
      return restOfPosts;
    });
  },
  getSinglePost: async (id, query = {}) => {
    const post = await request.get(`/posts/${id}`);
    const { fields } = query || {};

    if (Object.keys(post).length === 0) {
      throw new Error('Post Not Found');
    }
    return fieldsFilter(post, fields);
  },
  postPost: async (body) => {
    const { userId, title } = body;
    const user = await userService.getSingleUser(userId);

    if (!user) {
      throw new Error('User Not Found');
    }
    if (!userId) {
      throw new Error('User Not Found');
    }
    if (!title) {
      throw new Error('Bad Request');
    }
    return request.post('/posts', body);
  },
  async putPost(id, body) {
    const { userId } = body;
    const post = await this.getSinglePost(id);

    if (!post) {
      throw new Error('Post Not Found');
    }
    if (userId) {
      const user = await userService.getSingleUser(userId);

      if (!user) {
        throw new Error('User Not Found');
      }
    }
    return request.put(`/posts/${id}`, body);
  },
  async deletePost(id) {
    const post = this.getSinglePost(id);

    if (!post) {
      throw new Error('Post Not Found');
    }
    return request.delete(`/posts/${id}`)
  },
};
