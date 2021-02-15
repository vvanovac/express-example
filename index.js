require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const authRouter = require('./authentication/auth.router');
const userRouter = require('./users/users.router');
const postRouter = require('./posts/posts.router');
const { port } = require('./common/constants');

const app = express();

app.use(bodyParser.json());

authRouter(app);
userRouter(app);
postRouter(app);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Route not found' });
});

app.listen(port, () => {
  process.stdout.write(`Listening on port ${port}\n`);
});
