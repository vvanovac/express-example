const postService = require('./posts.service');

module.exports = {
  getAllPosts: async (req, res) => {
    try {
      const posts = await postService.getAllPosts(req.query);

      return res.status(200).json(posts);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  getSinglePost: async (req, res) => {
    try {
      const post = await postService.getSinglePost(req.params.postId, req.query);

      return res.status(200).json(post);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  postPost: async (req, res) => {
    try {
      const post = await postService.postPost(req.body);

      return res.status(201).json(post);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  putPost: async (req, res) => {
    try {
      const post = await postService.putPost(req.params.postId, req.body);

      return res.status(200).json(post);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  deletePost: async (req, res) => {
    try {
      const post = await postService.getSinglePost(req.params.postId);

      return res.status(200).json(post);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};
