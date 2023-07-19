const db = require('../db/connection');

exports.checkArticleIdExists = (article_id) => {
    if (/\D+/.test(article_id)) {
        return Promise.reject({status: 400, msg: "Invalid article id."})
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
    const query = `SELECT articles.*, 
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`;
    
    return db.query(query,[article_id]).then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "Article not found."})
        }
        return rows
        })
}

exports.selectAllArticles = (sort_by = 'created_at', order = 'desc', topic) => {
    let articlesQuery = `SELECT
        a.article_id,
        a.title,
        a.topic,
        a.author,
        a.created_at,
        a.votes,
        a.article_img_url,
        COUNT(c.comment_id) AS comment_count
    FROM articles AS a
    LEFT JOIN comments AS c 
    ON a.article_id = c.article_id`;

    const validSortBy = ['title', 'article_id', 'votes', 'created_at', 'topic']
    const validOrderBy = ['asc', 'desc']
    const values = []
 
    if (!validSortBy.includes(sort_by) && sort_by) {
        return Promise.reject({ status: 400, msg:"Bad request" })
    }
    if (!validOrderBy.includes(order) && order) {
        return Promise.reject({ status: 400, msg:"Bad request" })
    }

    if (topic) {
        articlesQuery += ` WHERE topic = $1`;
        values.push(topic)
    }

    articlesQuery += ` GROUP BY a.article_id ORDER BY ${sort_by} ${order}`;
    
    return db.query(articlesQuery, values).then(({ rows }) => {
        return rows
    })
}

exports.updateArticleByArticleId = (inc_votes, article_id) => {
    return db.query(`UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`, [inc_votes, article_id])
    .then(({rows})=>{
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "Article not found."})
        }
        return rows[0]
    })
}
