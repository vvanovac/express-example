const postsController = require('./posts.controller');

module.exports = (app) => {
  app.get('/posts', postsController.getAllPosts);

  app.get('/posts/:postId', postsController.getSinglePost);

  app.post('/posts', postsController.postPost);

  app.put('/posts/:postId', postsController.putPost);

  app.delete('/posts/:postId', postsController.deletePost);
};
