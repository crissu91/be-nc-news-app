const db = require('../db/connection');

exports.selectAllCommentsByArticleId = (article_id) =>{
    return db.query("SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC", [article_id]).then(({rows})=>{
        if (rows.length === 0) {
            return []
        }
        else return rows
    })
}