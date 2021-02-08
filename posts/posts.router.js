const controller = require('./posts.controller');

module.exports = (app) => {
    app.get('/posts', controller.getAllPosts);

    app.get('/posts/:postId', controller.getSinglePost);

    app.post('/posts', controller.postPost);

    app.put('/posts/:postId', controller.putPost);

    app.delete('/posts/:postId', controller.deletePost);
};
