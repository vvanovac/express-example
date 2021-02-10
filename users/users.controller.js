const userService = require('./users.service');

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const users = await userService.getAllUsers(req.query);

      return res.status(200).json(users);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },
  getSingleUser: async (req, res) => {
    try {
      const user = await userService.getSingleUser(req.params.userId, req.query);

      if (!user) {
        return res.status(404).send({ message: 'User Not Found' });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },
  postUser: async (req, res) => {
    try {
      const user = await userService.postUser(req.body);

      if (!user) {
        return res.status(400).send({ message: 'Bad Request' });
      }

      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },
  putUser: async (req, res) => {
    try {
      const exists = await userService.getSingleUser(req.params.userId);

      if (!exists) {
        return res.status(404).send({ message: 'User Not Found' });
      }
      const user = await userService.putUser(req.params.userId, req.body);

      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const user = await userService.getSingleUser(req.params.userId);

      if (!user) {
        return res.status(404).send({ message: 'User Not Found' });
      }
      await userService.deleteUser(req.params.userId);

      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },
};
