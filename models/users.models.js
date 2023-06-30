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