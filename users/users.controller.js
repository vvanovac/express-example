const userService = require('./users.service');

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const users = await userService.getAllUsers(req.query);
      return res.status(200).json(users);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  getSingleUser: async (req, res) => {
    try {
      const user = await userService.getSingleUser(req.params.userId, req.query);

      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  postUser: async (req, res) => {
    try {
      const user = await userService.postUser(req.body);

      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  putUser: async (req, res) => {
    try {
      const user = await userService.putUser(req.params.userId, req.body);

      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const user = await userService.getSingleUser(req.params.userId);

      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};
