const db = require('../db/connection');

exports.selectArticlesById = (article_id) =>{
    return db.query("SELECT * FROM articles WHERE article_id = $1",[article_id]).then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "Article not found."})
        }
        else return rows
        })
}

exports.selectAllArticles = () => {
    const articlesQuery = `SELECT
        a.article_id,
        a.title,
        a.topic,
        a.author,
        a.created_at,
        a.votes,
        a.article_img_url,
        COUNT(c.comment_id) AS comment_count
    FROM articles AS a
    LEFT JOIN comments AS c ON a.article_id = c.article_id
    GROUP BY a.article_id
    ORDER BY a.created_at DESC;`;

    return db.query(articlesQuery).then(({ rows }) => {
    return rows;
    });
}
