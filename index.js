const express = require('express');
const bodyParser = require('body-parser');

const userRouter = require('./users/users.router');
const postRouter = require('./posts/posts.router');

const app = express();

app.use(bodyParser.json());

userRouter(app);
postRouter(app);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Route not found' });
});

app.listen(3000, () => {
  process.stdout.write('Listening on port 3000\n');
});
