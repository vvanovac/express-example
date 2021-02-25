require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const authRouter = require('./authentication/auth.router');
const userRouter = require('./users/users.router');
const postRouter = require('./posts/posts.router');
const database = require('./database');
const { port } = require('./common/constants');

const startApplication = async () => {
  await database.init();
  const app = express();

  app.use(bodyParser.json());

  authRouter(app);
  userRouter(app);
  postRouter(app);

  app.all('*', (req, res) => {
    res.status(404).send({ message: 'Route not found' });
  });

  return app.listen(port, () => {
    process.stdout.write(`Listening on port ${port}\n`);
  });
};

startApplication();
