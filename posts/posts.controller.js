const postService = require('./posts.service');

module.exports = {
  getAllPosts: async (req, res) => {
    try {
      const posts = await postService.getAllPosts(req.query);

      return res.status(200).json(posts);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },
  getSinglePost: async (req, res) => {
    try {
      const post = await postService.getSinglePost(req.params.postId, req.query);

      if (!post) {
        return res.status(404).send({ message: 'Post Not Found' });
      }
      return res.status(200).json(post);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },
  postPost: async (req, res) => {
    try {
      const post = await postService.postPost(req.body);

      if (!post) {
        return res.status(400).send({ message: 'Bad Request' });
      }

      return res.status(201).json(post);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },
  putPost: async (req, res) => {
    try {
      const postId = +req.params.postId;

      const exists = await postService.getSinglePost(postId);

      if (!exists) {
        return res.status(404).send({ message: 'Post Not Found' });
      }
      const post = await postService.putPost(postId, req.body);

      if (!post) {
        return res.status(404).send({ message: 'User Not Found' });
      }

      return res.status(200).json(post);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },
  deletePost: async (req, res) => {
    try {
      const post = await postService.getSinglePost(req.params.postId);

      if (!post) {
        return res.status(404).send({ message: 'Post Not Found' });
      }
      await postService.deletePost(req.params.postId);

      return res.status(200).json(post);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },
};
