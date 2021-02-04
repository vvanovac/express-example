const fetch = require("node-fetch");

module.exports = (app) => {
    app.get('/posts', async (req, res) => {
        try {
            const { sort: reqQuery } = req.query;

            const response = await fetch(`https://jsonplaceholder.typicode.com/posts`);
            const posts = await response.json();

            if (reqQuery === undefined) {
                return res.status(200).json(posts);
            } else {
                let postsSorted = posts.sort((post1, post2) => {
                    const key = reqQuery.replace(/^-/, '');
                    if (typeof(post1[key]) === "string") {
                        return post1[key].localeCompare(post2[key]);
                    } else if (typeof(post1[key]) === "number") {
                        return post1[key] - post2[key];
                    }
                    return 0;
                })
                if (reqQuery.startsWith('-')) {
                    postsSorted = postsSorted.reverse();
                }

                return res.status(200).send(postsSorted);
            }
        } catch (error) {
            res.status(400).json(error.message);
        }
    })
    app.get('/posts/:postId', async (req, res) => {
        try {
            const id = req.params.postId;
            const response = await fetch(`http://jsonplaceholder.typicode.com/posts/${id}`);
            const post = await response.json();

            if (Object.keys(post).length === 0) {
                res.status(404).send( {message: 'Post Not Found' });
            } else {
                return res.status(200).json(post);
            }
        } catch (error) {
            res.status(400).json(error.message);
        }
    })

    app.post('/posts', async (req, res) => {
        try {
            const response = await fetch(`http://jsonplaceholder.typicode.com/posts`, {
                method: "POST",
                body: JSON.stringify(req.body),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
            });
            const post = await response.json();
            return res.status(200).json(post);
        } catch (error) {
            res.status(400).json(error.message);
        }
    })

    app.put('/posts/:postId', async (req, res) => {
        try {
            let id = req.params.postId;

            const response = await fetch(`http://jsonplaceholder.typicode.com/posts/${id}`, {
                method: "PUT",
                body: JSON.stringify(req.body),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
            });
            const post = await response.json();
            return res.status(200).json(post);
        } catch (error) {
            res.status(400).json(error.message);
        }
    })

    app.delete('/posts/:postId', async (req, res) => {
        try {
            const id = req.params.postId;

            if (id > 100) {
                res.status(404).send("Post Not Found");
            } else {
                const response = await fetch(`http://jsonplaceholder.typicode.com/posts/${id}`, {
                    method: "DELETE",
                });
                const post = await response.json();
                res.status(200).send({ message: `Post with id of ${id} deleted successfully.` });
                return res.status(200).json(post);
            }
        } catch (error) {
            res.status(400).json(error.message);
        }
    })
};
