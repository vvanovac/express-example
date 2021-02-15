const authController = require('./auth.controller');

module.exports = (app) => {
  app.post('/login', authController.login);

  app.post('/register', authController.register);

  app.use(authController.verifyToken);
};
