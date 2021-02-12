require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const authController = require('./authentication/auth.controller');
const userRouter = require('./users/users.router');
const postRouter = require('./posts/posts.router');
const { port } = require('./common/constants');

const app = express();

app.use(bodyParser.json());

app.post('/login', authController.login);

app.use(authController.verifyToken);

userRouter(app);
postRouter(app);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Route not found' });
});

app.listen(port, () => {
  process.stdout.write(`Listening on port ${port}\n`);
});
