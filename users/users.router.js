const controller = require('./users.controller');

module.exports = (app) => {
  app.get('/users', controller.getAllUsers);

  app.get('/users/:userId', controller.getSingleUser);

  app.post('/users', controller.postUser);

  app.put('/users/:userId', controller.putUser);

  app.delete('/users/:userId', controller.deleteUser);
};
