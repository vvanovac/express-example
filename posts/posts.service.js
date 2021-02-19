const userService = require('../users/users.service');
const LocalService = require('../common/local.service');

module.exports = {
  getAllPosts: async (query) => {
    const {
      sort, skip, limit, fields, ...searchQuery
    } = query;

    const posts = await new LocalService('posts')
      .find(searchQuery)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(fields)
      .exec();

    const userIds = posts.map((post) => post.userId);
    const userIdsUnique = userIds.filter((id, index) => userIds.indexOf(id) === index);
    const someUsers = await userService.getUsersById(userIdsUnique);

    return posts.map((post) => {
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
  getSinglePost: async (id) => {
    const post = await new LocalService('posts')
      .findOne(+id)
      .exec();

    if (!post) {
      throw new Error('Post Not Found');
    }
    return post;
  },
  postPost: async (body) => {
    const { userId, title } = body;
    const user = await new LocalService('users')
      .findOne(+userId)
      .exec();

    if (!user) {
      throw new Error('User Not Found');
    }
    if (!userId) {
      throw new Error('Bad Request');
    }
    if (!title) {
      throw new Error('Bad Request');
    }
    await new LocalService('posts')
      .create(body)
      .exec();

    return body;
  },
  putPost: async (id, body) => {
    const { userId } = body;
    const post = await new LocalService('posts')
      .findOne(+id)
      .exec();
    const user = await new LocalService('users')
      .findOne(+userId)
      .exec();

    if (!post) {
      throw new Error('Post Not Found');
    }
    if (!userId) {
      throw new Error('Bad Request');
    }
    if (!user) {
      throw new Error('User Not Found');
    }

    await new LocalService('posts')
      .update(+id, body)
      .exec();

    return body;
  },
  deletePost: async (id) => {
    const post = await new LocalService('posts')
      .findOne(+id)
      .exec();

    if (!post) {
      throw new Error('Post Not Found');
    }
    await new LocalService('posts')
      .delete(+id)
      .exec();

    return post;
  },
};
