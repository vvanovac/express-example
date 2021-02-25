const authController = require('./auth.controller');

module.exports = (app) => {
  app.put('/login', authController.login);

  app.post('/register', authController.register);

  app.use(authController.verifyToken);
};
