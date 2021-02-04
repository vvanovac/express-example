const fetch = require("node-fetch");

module.exports = (app) => {
    app.get('/users', async (req, res) => {
        try {
            const { sort: reqQuery } = req.query;

            const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
            const users = await response.json();

            if (reqQuery === undefined) {
                return res.status(200).json(users);
            } else {
                let usersSorted = users.sort((user1, user2) => {
                    const key = reqQuery.replace(/^-/, '');
                    if (typeof(user1[key]) === "string") {
                        return user1[key].localeCompare(user2[key]);
                    } else if (typeof(user1[key]) === "number"){
                        return user1[key] - (user2[key]);
                    }
                    return 0;
                })
                if (reqQuery.startsWith('-')) {
                    usersSorted = usersSorted.reverse();
                }

                return res.status(200).json(usersSorted);
            }
        } catch (error) {
            res.status(400).json(error.message);
        }
    })

    app.get('/users/:userId', async (req, res) => {
        try {
            const id = req.params.userId;
            const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
            const user = await response.json();

            if (Object.keys(user).length === 0) {
                res.status(404).send({ message: 'User Not Found' });
            } else {
                return res.status(200).json(user);
            }
        } catch (error) {
            res.status(400).json(error.message);
        }
    })

    app.post('/users', async (req, res) => {
        try {
            const response = await fetch(`http://jsonplaceholder.typicode.com/users`, {
                method: "POST",
                body: JSON.stringify(req.body),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
            });
            const user = await response.json();
            return res.status(200).json(user);
        } catch (error) {
            res.status(400).json(error.message);
        }
    })

    app.put('/users/:userId', async (req, res) => {
        try {
            const id = req.params.userId;

            const response = await fetch(`http://jsonplaceholder.typicode.com/users/${id}`, {
                method: "PUT",
                body: JSON.stringify(req.body),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
            });
            const user = await response.json();
            return res.status(200).json(user);
        } catch (error) {
            res.status(400).json(error.message);
        }
    })

    app.delete('/users/:userId', async (req, res) => {
        try {
            const id = req.params.userId;

            if (id > 10) {
                res.status(404).send("User Not Found")
            } else {
                const response = await fetch(`http://jsonplaceholder.typicode.com/users/${id}`, {
                    method: "DELETE",
                });
                const user = await response.json();

                res.status(200).send( {message: `User with id of ${id} deleted successfully.` });
                return res.status(200).json(user);
            }
        } catch (error) {
            res.status(400).json(error.message);
        }
    })
};
