const { selectAllUsers, postUser, selectUserByUsername } = require("../models/users.models")

exports.getAllUsers = (req, res, next) => {
    return selectAllUsers()
    .then((users) => {
        res.status(200).send({users})
    })
    .catch(next)
}

exports.getUserByUsername = (req, res, next) => {
	const username = req.params.username;
	selectUserByUsername(username)
		.then((user) => {
			res.status(200).send({ user });
		})
		.catch(next);
}

exports.postNewUser = (req, res, next) => {
	const body = req.body;

	postUser(body)
		.then((postedUser) => {
			res.status(201).send({ postedUser });
		})
		.catch(next);
}