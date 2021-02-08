const service = require('./users.service');

module.exports = {
    getAllUsers: async (req, res) => {
        try {
            const users = await service.getAllUsers(req.query);

            return res.status(200).json(users);
        } catch (error) {
            res.status(400).json(error.message);
        }
    },
    getSingleUser: async (req, res) => {
        try {
            const user = await service.getSingleUser(req.params.userId, req.query);

            if (!user) {
                return res.status(404).send({ message: "User Not Found" });
            }
            return res.status(200).json(user);
        } catch (error) {
            res.status(400).json(error.message);
        }
    },
    postUser: async (req, res) => {
        try {
            const user = await service.postUser(req.body);

            return res.status(201).json(user);
        } catch (error) {
            res.status(400).json(error.message);
        }
    },
    putUser: async (req, res) => {
        try {
            const exists = await service.getSingleUser(req.params.userId);

            if (!exists) {
                return res.status(404).send({ message: "User Not Found" });
            }
            const user = await service.putUser(req.params.userId, req.body);

            return res.status(200).json(user);
        } catch (error) {
            res.status(400).json(error.message);
        }
    },
    deleteUser: async (req, res) => {
        try {
            const user = await service.getSingleUser(req.params.userId);

            if (!user) {
                return res.status(404).send({ message: "User Not Found" });
            }
            await service.deleteUser(req.params.userId);

            return res.status(200).json(user);
        } catch (error) {
            res.status(400).json(error.message);
        }
    }
}
