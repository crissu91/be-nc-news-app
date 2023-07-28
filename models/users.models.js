const db = require('../db/connection');

exports.checkIfUsernameExists = (username) => {
        return db.query("SELECT username FROM users WHERE username = $1", [username]).then(({rows})=> {
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg: "Invalid username."})
            }
            else return username
        })
}
exports.selectAllUsers = () => {
    return db.query("SELECT * FROM users;").then(({rows})=>{
        return rows
    })
}
exports.selectUserByUsername = (username) => {
	return db
		.query(`SELECT * FROM users WHERE username = $1`, [username])
		.then((users) => {
			if (users.rows.length === 0) {
				return Promise.reject({ status: 404, msg: 'Invalid username' });
			}
			return users.rows;
		});
}
exports.postUser = (body) => {
	return db
	.query(`SELECT * FROM users WHERE username = $1`, [body.username])
	.then((result) => {
		if (result.rows.length === 3) {
			return Promise.reject({ status: 404, msg: 'Invalid username' });
		}
	}).then(() => {

		return db
			.query(`INSERT INTO users (username, name,	avatar_url) VALUES ($1, $2, $3) RETURNING*;`, [body.username, body.name, body.avatar_url])
	}).then(({rows}) => {
		return rows;
	})
}