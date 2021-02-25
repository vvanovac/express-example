const userService = require('../users/users.service');
const LocalService = require('../common/local.service');
const messages = require('../common/message.constants');

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
      // .join('users', 'id', 'creator')
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
      throw new Error(messages.POST_NOT_FOUND);
    }
    return post;
  },
  postPost: async (body) => {
    const { userId, title } = body;
    const user = await new LocalService('users')
      .findOne(+userId)
      .exec();

    if (!user) {
      throw new Error(messages.USER_NOT_FOUND);
    }
    if (!userId) {
      throw new Error(messages.CREATOR_MISSING);
    }
    if (!title) {
      throw new Error(messages.TITLE_MISSING);
    }
    await new LocalService('posts')
      .create(body);

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
      throw new Error(messages.POST_NOT_FOUND);
    }
    if (!userId) {
      throw new Error(messages.CREATOR_MISSING);
    }
    if (!user) {
      throw new Error(messages.USER_NOT_FOUND);
    }

    return new LocalService('posts')
      .update(+id, body);
  },
  deletePost: async (id) => {
    const post = await new LocalService('posts')
      .findOne(+id)
      .exec();

    if (!post) {
      throw new Error(messages.POST_NOT_FOUND);
    }
    await new LocalService('posts')
      .delete(+id);

    return post;
  },
};
