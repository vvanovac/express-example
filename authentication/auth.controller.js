const authService = require('./auth.service');

module.exports = {
  login: (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username) {
        return res.status(400).send({ message: 'Please Enter Username.' });
      }
      if (!password) {
        return res.status(400).send({ message: 'Please Enter Password.' });
      }

      const token = authService.loginUser(req.body);

      return res.status(200).send({ message: 'Logged in successfully.', token });
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },
  verifyToken: (req, res, next) => {
    try {
      req.user = authService.verifyToken(req.headers.authorization);

      return next();
    } catch (error) {
      return res.status(401).send({ message: error.message });
    }
  },
  register: async (req, res) => {
    try {
      const user = await authService.registerUser(req.body);
      if (!user) {
        return res.status(400).send({ message: 'Bad Request' });
      }
      return res.status(200).send({ message: 'Registration completed.' });
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },
};
