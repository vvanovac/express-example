const express = require("express");
const bodyParser = require("body-parser");

const userRouter = require('./user.router');
const postRouter = require('./posts.router');

const app = express();

app.use(bodyParser.json());

userRouter(app);
postRouter(app);

app.all('*', (req, res) => {
    res.status(404).send({ message: "Route not found" });
})

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
