const service = require('./posts.service');

module.exports = {
    getAllPosts: async (req, res) => {
        try {
            const posts = await service.getAllPosts(req.query);

            return res.status(200).json(posts);
        } catch (error) {
            res.status(400).json(error.message);
        }
    },
    getSinglePost: async (req, res) => {
        try {
            const post = await service.getSinglePost(req.params.postId);

            if (!post) {
               return res.status(404).send({ message: "Post Not Found" });
            }
            return res.status(200).json(post);
        } catch (error) {
            res.status(400).json(error.message);
        }
    },
    postPost: async (req, res) => {
        try {
            const post = await service.postPost(req.body);

            return res.status(201).json(post);
        } catch (error) {
            res.status(400).json(error.message);
        }
    },
    putPost: async (req, res) => {
        try {
            const exists = await service.getSinglePost(req.params.postId);

            if (!exists) {
                return res.status(404).send({ message: "Post Not Found" });
            }
            const post = await service.putPost(req.params.postId, req.body);

            return res.status(200).json(post);
        } catch (error) {
            res.status(400).json(error.message);
        }
    },
    deletePost: async (req, res) => {
        try {
            const post = await service.getSinglePost(req.params.postId);

            if (!post) {
                return res.status(404).send({ message: "Post Not Found" });
            }
            await service.deletePost(req.params.postId);

            return res.status(200).json(post);
        } catch (error) {
            res.status(400).json(error.message)
        }
    }
}
