const db = require('../db/connection');

exports.checkArticleIdExists = (article_id) => {
    if (/\D+/.test(article_id)) {
        return Promise.reject ({ status: 400, msg:"Article ID is invalid"});
    }
    else if (/\d+/.test(article_id)) {
        return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id]).then(({rows})=> {
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg: "Article not found."})
            }
            else return rows
        })
    }
}

exports.selectArticlesById = (article_id) =>{
    return db.query("SELECT * FROM articles WHERE article_id = $1",[article_id]).then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "Article not found."})
        }
        return rows
        })
}