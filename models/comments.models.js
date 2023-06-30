const db = require('../db/connection');

exports.selectAllCommentsByArticleId = (article_id) =>{
    return db.query("SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC", [article_id]).then(({rows})=>{
        if (rows.length === 0) {
            return []
        }
        else return rows
    })
}

exports.insertCommentByArticleId = (body, article_id) => {
    const queryString = `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;`;
    const queryValues = [body.body, body.username, article_id]

    if (!body.body) {
        return Promise.reject({status: 400, msg: 'Missing data'})
    }

    return db.query(queryString, queryValues).then((comment)=>{
        return comment.rows
    })
}

exports.checkCommentIdExists = (comment_id) => {
    if (/\D+/.test(comment_id)) {
        return Promise.reject({status: 400, msg: "Bad request"})
    }
    else if (/\d+/.test(comment_id)) {
        return db.query("SELECT * FROM comments WHERE comment_id = $1", [comment_id]).then(({rows})=> {
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg: "Comment not found."})
            }
        else return rows
        })
    }
}
exports.removeCommentById = (comment_id) =>{
    return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *;', [comment_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Comment not found."})
        }
    })
}
