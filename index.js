require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const authService = require('./authentication/auth.service');

const userRouter = require('./users/users.router');
const postRouter = require('./posts/posts.router');

const app = express();

app.use(bodyParser.json());

app.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const user = authService.loginUser(username, password);

    if (!username) {
      return res.status(400).send({ message: 'Please Enter Username.' });
    }
    if (!password) {
      return res.status(400).send({ message: 'Please Enter Password.' });
    }
    if (!user) {
      return res.status(401).send({ message: 'Login failed. Invalid Username and/or Password' });
    }

    const token = authService.loginUser(username, password);

    if (!token) {
      return res.status(401).send({ message: 'Token Expired' });
    }
    return res.status(200).send({ message: 'Logged in successfully.', token });
  } catch (error) {
    return res.status(400).send({ message: 'Bad Request' });
  }
});

app.use((req, res, next) => {
  try {
    req.user = authService.verifyToken(req.headers.authorization);

    return next();
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
});

userRouter(app);
postRouter(app);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Route not found' });
});

app.listen(process.env.PORT || 3000, () => {
  process.stdout.write(`Listening on port ${process.env.PORT}\n`);
});
